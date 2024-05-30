import Box from '@mui/material/Box';
import aicon from '../assets/Avatar.png';
import { Typography } from '@mui/material';

export default function StartChatMain(){
    return(
        <>
        
        <Box sx={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', mt:15}}>
            <img style={{width:100, borderRadius:60, boxShadow:'0 0 10px 2px rgba(255, 255, 255, 0.5)',}} src={aicon} alt="pilz ai icon" />
            <Typography sx={{mt:5}} variant='h4' color='white'>Welcome to PilzAI. How can I help you today?</Typography>   
        </Box>
        </>
    );
}