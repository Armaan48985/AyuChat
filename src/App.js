import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import logoimg from './images/logo1.jpg'
import {HiMenu} from 'react-icons/hi'
import {IoHelp} from 'react-icons/io5'
import Popup from './popup';
import backgroundLogo from './images/backgroundLogo.png'

<style>
  @import url('https://fonts.googleapis.com/css2?family=Karla:wght@700;800&family=Poppins:wght@400;700&family=Roboto:wght@300;400&family=Stylish&display=swap');
</style>

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [historybarOpen, setHistorybarOpen] = useState(false)

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const storedChatLog = localStorage.getItem('chatLog');
    if (storedChatLog) {
      setChatLog(JSON.parse(storedChatLog));
    }
    console.log(storedChatLog)
  }, []);

  // Update local storage whenever the chatLog state changes
  useEffect(() => {
    localStorage.setItem('chatLog', JSON.stringify(chatLog));
  }, [chatLog]);

  
  const sendMessage = () => {
    const newUserInput = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";

    // Display user message
    setChatLog([...chatLog, { text: newUserInput, sender: 'user' }]);

    // Send user message to server and get bot's response
    fetch("/ask", {
      method: "POST",
      body: new URLSearchParams({ user_input: newUserInput }),
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(data => {
      // Display bot's response
      setChatLog([...chatLog, { text: data.bot_response, sender: 'bot' }]);
      console.log("updated", chatLog)

    })
    .catch(error => {
      console.error("Error:", error);
    });

    setUserInput("")
  };

  function handeSidebar(){
    setSidebarOpen(e => !e)
  }

  function handeHelpbar(){
    setSidebarOpen(e => !e)
  }

  function handleNewPage(){
    setChatLog([])
  }

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  return (

     <div className="container">
       <Popup isOpen={isPopupOpen} onClose={closePopup}/>

      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="box" onClick={handleNewPage}>New Page</div>
        <div
          className="box"   
          onMouseEnter={() => setHistorybarOpen(true)}
          onMouseLeave={() => setHistorybarOpen(false)}>
            History
        </div>
        <div className={`history-box ${historybarOpen ? 'show' : ''}`}>
          {chatLog.map((message, index) => (
            <div key={index} className={`history-message`}>
              {message.text}
            </div>
          ))}
        </div>
        {/* Add more menu items as needed */}
      </div>

      <div className="chat-container">

        <img className='backgroundLogo' src={backgroundLogo}/>
      <span className='menu-icon' onClick={handeSidebar}><HiMenu/></span>
      <span className='help-icon' onClick={() => setPopupOpen(true)}><IoHelp/></span>
      <img className="logoImg" src={logoimg}/>

        <div className="chat-header">
          <h2 onClick={handleReload}>AyuChat</h2>
        </div>
        <div className="chat-messages">
          {chatLog.map((message, index) => (
            <div key={index} className={`message ${message.sender}-message`}>{message.text}</div>
          ))}
        </div>
        <div className="user-input-container">
          <input
            type="text"
            className="user-input"
            id="user-input"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>

  );
    }


export default App;
