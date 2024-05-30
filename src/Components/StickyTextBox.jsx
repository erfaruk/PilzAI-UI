import React, { useEffect, useState } from 'react';
import { Box,Button, TextField, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Copyright from '../Components/Copyright';
import FetchAPI from './FetchAPI';

function StickyFooter({ drawerOpen }) {
  const [leftPosition, setLeftPosition] = useState(drawerOpen ? 240 : 0);
  const [selectedFile, setSelectedFile] = useState([]);
  const [creaId, SetCreaId] = useState(null);
  const navigate=useNavigate();
  let { chatId } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeftPosition(drawerOpen ? 240 : 0);
    }, 10); // Set a delay for the drawer transition

    return () => clearTimeout(timer);
  }, [drawerOpen]);

  const handleFileChange = (event) => {
    setSelectedFile(prevFiles => [...prevFiles, ...event.target.files]);
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = selectedFile.filter((_, i) => i !== index);
    setSelectedFile(updatedFiles);
    document.getElementById('userMessage').focus();
  };

  const sendClick = async () => {
    let currentText = document.getElementById('userMessage').value;
    const encodedMessage = encodeURIComponent(currentText);
    
    if (currentText !== '' || selectedFile.length > 0) {
      if (chatId == null) {
        try {
          if (selectedFile.length > 0) {
            // Create new chat with the first image and text
            const firstFile = selectedFile[0];
            const reader = new FileReader();
            reader.onloadend = async () => {
              try {
                const response = await FetchAPI(`Chats/AutoAddChatwMeida`, "POST", reader.result);
                navigate(`/chat/${response.result}`);
                
                // Send remaining images
                const remainingFiles = selectedFile.slice(1);
                for (const file of remainingFiles) {
                  const fileReader = new FileReader();
                  await new Promise((resolve, reject) => {
                    fileReader.onloadend = () => {
                      FetchAPI(`Chats/AddImageChat?chatid=${response.result}`, "POST", fileReader.result)
                        .then(resolve)
                        .catch(reject);
                    };
                    fileReader.readAsDataURL(file);
                  });
                }
                // Send text message
                if (currentText !== '') {
                  await FetchAPI(`Chats/AddMessagetoChat?message=${encodedMessage}&chatid=${response.result}`, "POST");
                }
                
                // Call getCompletion API
                await FetchAPI(`api/OpenAI/getCompletion?chatid=${response.result}`, "GET");
              } catch (error) {
                console.error('Error adding chat with media:', error);
              }
            };
            reader.readAsDataURL(firstFile);
          } else {
            // Create new chat with text only
            const response = await FetchAPI(`Chats/AutoAddChat?message=${encodedMessage}`, "POST");
            navigate(`/chat/${response.result}`);
            await FetchAPI(`api/OpenAI/getCompletion?chatid=${response.result}`, "GET");
          }
          setSelectedFile([]);
          document.getElementById('userMessage').value = null;
          document.getElementById('userMessage').focus();
        } catch (error) {
          console.error('Error adding chat:', error);
        }
      } else {
        try {
          // Upload images if any
          if (selectedFile.length > 0) {
            const uploadPromises = selectedFile.map((file) => {
              const reader = new FileReader();
              return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                  FetchAPI(`Chats/AddImageChat?chatid=${chatId}`, "POST", reader.result)
                    .then(response => resolve(response))
                    .catch(error => reject(error));
                };
                reader.readAsDataURL(file);
              });
            });
            try {
              await Promise.all(uploadPromises);
            } catch (error) {
              console.error('Error uploading images:', error);
            }
          }
          // Add text message if any
          if (currentText !== '') {
            await FetchAPI(`Chats/AddMessagetoChat?message=${encodedMessage}&chatid=${chatId}`, "POST");
          }
          // Call getCompletion API
          await FetchAPI(`api/OpenAI/getCompletion?chatid=${chatId}`, "GET");
  
          setSelectedFile([]);
          document.getElementById('userMessage').value = null;
          document.getElementById('userMessage').focus();
        } catch (error) {
          console.error('Error adding message to chat:', error);
        }
      }
    } else {
      document.getElementById('userMessage').focus();
    }
  };
  
  
  

  return (
    <>
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: leftPosition, // Use the state for the left position
      right: 0,
      bgcolor: '#242424', // Match the body background color
      paddingTop: '20px',
      paddingBottom: '8px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      flexDirection:'column',
      alignItems: 'center',
      transition: 'left 0.3s ease' // Add a transition effect
    }}>
      <Box sx={{ width: '100%', maxWidth: 800, backgroundColor: 'white', borderRadius: 10, display: 'flex', alignItems: 'center' }}>
      <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-file"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        <TextField
          id='userMessage'
          sx={{ ml: 3.8,  mr: 3.8 }}
          variant="standard"
          fullWidth
          color='warning'
          multiline
          maxRows={7} // Limit the maximum number of rows to grow
          placeholder="Send message to PilzAI app"
          InputProps={{
            startAdornment:(
          <label htmlFor="upload-file">
            <IconButton  aria-label="upload-file" component="span" sx={{mr:1, ml:-2}}>
              <AttachFileRoundedIcon />
            </IconButton>
          </label>),
            endAdornment: (
              <IconButton aria-label="send message" onClick={sendClick} sx={{ml:1}}>
                <SendIcon />
              </IconButton>
            )
          }}
        />
      </Box>
      {Array.isArray( selectedFile) && (
          <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
            {selectedFile.map((file, index) => (
              <Box key={index} sx={{ border: '1px solid #ccc', borderRadius: 3, p:0.7, alignItems:'center', display:'flex' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 5 }}
                />
                <IconButton sx={{position:'absolute', ml:5.5, mb:8, color:'white'}}
                onClick={() => handleDeleteFile(index)}>
                  <DeleteRoundedIcon/>
                </IconButton>
                
              </Box>
            ))}
          </Box>
        )}
      <Copyright/>
    </Box>
    
    </>
  );
};

export default StickyFooter;
