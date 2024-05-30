import React from 'react';
import { useParams } from 'react-router-dom';
import DetailsDrawer from "../Components/DetailsDrawer.jsx";

function ChatDetail() {
  const params = useParams();
  const chatId=params.chatId
  //console.log('Chat ID:', chatId);  // Debugging line

  return (
    <>
    <DetailsDrawer chatId={chatId}/>   
    </>
  );
}

export default ChatDetail;
