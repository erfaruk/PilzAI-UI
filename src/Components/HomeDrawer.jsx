import * as React from 'react';
import { useEffect, useState } from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MapsUgcRoundedIcon from '@mui/icons-material/MapsUgcRounded';
import DiamondRoundedIcon from '@mui/icons-material/DiamondRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Button, ListItemAvatar, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import ChatCards from './ChatCards.jsx';
import profilephoto from '../assets/ProfilePhoto.jpg';
import FetchAPI from './FetchAPI.jsx';
import { useNavigate } from 'react-router-dom';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const models = ['GPT-4o', 'GPT-4', 'GPT-3.5'];
const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    backgroundColor:'#242424',
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [modelSelect, setModelSelect] = React.useState(null);


  const [chats, setChats] = useState([]);

  useEffect(() => {
      async function fetchChats() {
      const response = await FetchAPI("Chats/Chats", "GET") 
      setChats(response.result);
  }
      fetchChats();
  })
  
  const handleChatClick=(key)=>{
    navigate(`/chat/${key}`);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openModelSelect = (event) => {
    setModelSelect(event.currentTarget);
  };

  const closeModelSelect = () => {
    setModelSelect(null);
  };

  return (
    <Box sx={{ display: 'fixed' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{backgroundColor:'rgb(5, 30, 52)'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
           <ViewListRoundedIcon fontSize='medium'/>
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={profilephoto} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{display:'flex', justifyContent:'space-between'}}>
          <IconButton onClick={handleDrawerClose}>
            <ViewListRoundedIcon fontSize='medium'/>
          </IconButton>
          {/* <IconButton onClick={()=>navigate({pathname:"/"})}>
          <EditNoteRoundedIcon fontSize='large'/>
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        <List>
          {['Chat Completion', 'Image Generator'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={()=>navigate({pathname: "/chat"})}>
                <ListItemIcon>
                  {index === 0 ? <AutoAwesomeRoundedIcon /> :""}
                  { index === 1 ? <DiamondRoundedIcon/>:""}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {chats.map((c) => (
            <ListItem key={c.id} disablePadding>
              <ListItemButton onClick={() => handleChatClick(c.id)}>
                <ListItemIcon>
                  <MapsUgcRoundedIcon/> 
                </ListItemIcon>
                <ListItemText primary={c.chatTitle} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader/>
        <ChatCards drawerOpen={open}/>
      </Main>  
    </Box>
  );
}
