import React from 'react'
import './Input.css'
//to create an input component to send message
const input = ({message, setMessage, sendMessage}) => {
  return (
    <form action="" onSubmit={sendMessage} className="form">
        <input type="text" className="input"
        placeholder="Type a message"
        value={message} 
        onChange={event=> setMessage(event.target.value)}
        onKeyDown={event => event.key === 'Enter' ? sendMessage(event) : null} 
        />
        <button className="sendButton">Send</button>
  </form>
  )
}

export default input