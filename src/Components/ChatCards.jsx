import * as React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Copyright from '../Components/Copyright';

export default function ChatCards(drawerOpen){
    const navigate = useNavigate();

    const [leftPosition, setLeftPosition] = useState(drawerOpen ? 240 : 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeftPosition(drawerOpen ? 240 : 0);
    }, 10); // Set a delay for the drawer transition

    return () => clearTimeout(timer);
  }, [drawerOpen]);
    return(
    <>
    <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent:'center',
          '& > :not(style)': {
            m: 10,
          },
        }}
      > 
        <Card sx={{ maxWidth: 355 }}>
            <CardActionArea onClick={()=>navigate({pathname:'/chat'})}>
                <CardMedia
                    component="img"
                    height="140"
                    image="src/assets/ChatCompletion.jpg"
                    alt="green iguana"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Chat Completions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Get answers. Find inspiration. Be more productive. Free to use. Easy to try. Just ask and PilzAI can help with writing, learning, brainstorming and more.
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 355 }}>
            <CardActionArea onClick={()=>navigate({pathname:'/chat'})}>
                <CardMedia
                    component="img"
                    height="140"
                    image="src/assets/ImageGenerator.jpg"
                    alt="green iguana"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Image Generator
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Discover the world of image creation where imagination meets technology. Generate stunning visuals and explore endless creative possibilities with our state-of-the-art image generator.
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 355 }}>
            <CardActionArea onClick={()=>navigate({pathname:'/chat'})}>
                <CardMedia
                    component="img"
                    height="140"
                    image="src/assets/TrainAI.jpg"
                    alt="green iguana"
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Train Your Chat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    Enhance your chatbot's performance with advanced training techniques. Learn how to optimize conversations, improve accuracy, and create a more engaging user experience.
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            
      </Box>
      <Box sx={{position:'fixed',
                bottom:10, 
                justifyContent:'center', 
                display:'flex', 
                alignItems:'center',
                left: leftPosition, // Use the state for the left position
                right: 0,
                }}>
        <Copyright></Copyright>
      </Box>
      </>
      );
}