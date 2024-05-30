import { Route, Routes } from "react-router-dom";
// import FirstPage from "./FirstPage.jsx";
import Home from "./Pages/Home.jsx";
import Chat from "./Pages/Chat.jsx";
import ChatDetail from "./Pages/ChatDetail.jsx";
import NotFound from "./Pages/NotFound.jsx";


function App(){
    return(
        <Routes>
            {/* <Route exact path="/" element={<FirstPage/>}></Route> */}
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/chat" element={<Chat/>}/>
                <Route  path="/chat/:chatId" element={<ChatDetail/>}/>
            <Route  path="*" element={<NotFound/>}/>
        </Routes>
    );
}
export default App;