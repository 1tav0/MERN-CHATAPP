import React from 'react'
import Message from '../message/Message'
import STB from 'react-scroll-to-bottom';
import './Messages.css'

//to pass the data to the message component aka to view the text in the room 
const Messages = ({messages, user_id}) => {
  return (
    <STB className="messages">
        {/* when we set as jhon button and put it into a room we will see this */}
        {/* Messages {user_id}  */}
        {/* this shows the json format of the Schema when we type when we go to the room*/}
        {/* {JSON.stringify(messages)} */}
        {/* these shows the text message */}
        {/* {messages.map((message,i) => (
            <div key={message._id}>{message.text}</div>
        ))} */}
        {/* TO DISPLAY TEXT WE TYPE IN ROOM  */}
        Messages {user_id} 
        {messages.map((message,i) => (
            <Message key={message._id} message= {message} current_uid={user_id}/>
        ))}

    </STB>
  )
}

export default Messages