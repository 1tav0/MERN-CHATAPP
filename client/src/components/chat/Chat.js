import React, {useContext,useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import {Link, useParams} from 'react-router-dom';
import io from 'socket.io-client';
import Messages from './messages/Messages';
import Input from './input/Input';
import './Chat.css'
let socket;


const Chat = () => {
  // const ENDPT = 'localhost:5000';
  const ENDPT = 'mernchat-backend-12ed1a55588c.herokuapp.com';
  const {user,setUser} = useContext(UserContext);
  let {room_id, room_name } = useParams();
  const [message,setMessage] = useState(''); //for send message function
  const [messages, setMessages] = useState([]); //to receive messages by other clients

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('join',{name:user.name,room_id,user_id:user._id})
  }, [])

  //to receive messages by other clients
  useEffect(()=>{
    socket.on('message', message =>{
      setMessages([...messages,message]) //would update the component's state with a new messages array that includes all of the elements of the original messages array, plus the new message element at the end,
    })
  },[messages])

  const sendMessage = event =>{ //for send message function
    event.preventDefault();
    if(message){
      console.log(message);
      socket.emit('sendMessage',message,room_id,()=>setMessage('')); //emit message to the server
    }
  }
  return (
    <div className="outerContainer">
      {/* <div>{room_id} {room_name} </div> */}
        {/* <h1>Chat {JSON.stringify(user)}</h1> */}
        {/* to receive messages by other clients and make it look nicer */}
        {/* <pre>{JSON.stringify(messages,null,'\t')}</pre>  */}
        {/* to pass the data to the message component from messages folder */}
        <div className="container">
          <Messages messages={messages} user_id={user._id}/>
          {/* <Link to={'/'}>
            <button>Go to home</button>
          </Link> */}
          {/* {form for send message function } */}
          {/* copied in input file */}
          {/* <form action="" onSubmit={sendMessage}>
            <input type="text" value={message} 
              onChange={event=> setMessage(event.target.value)}
              onKeyDown={event => event.key === 'Enter' ? sendMessage(event) : null} 
            />
            <button>Send</button>
          </form> */}
          <Input 
            message = {message}
            setMessage = {setMessage}
            sendMessage = {sendMessage}
          />
        </div>
    </div>
  )
}

export default Chat