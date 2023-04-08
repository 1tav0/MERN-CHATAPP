
const express = require('express');
const app = express();
const cors = require('cors');//we get a cors policy error when try catch the code in signup flie in client side so we do this to resolve it 

const cookieParser = require('cookie-parser'); //to set and get cookies with options 
var corsOptions = { //for cors to call up signup api from client 
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus:200
}
const authRoutes = require('./routes/authRoutes');
app.use(cors(corsOptions));//for cors to call up signup api from client 
app.use(express.json());//pass the incoming request with json pillows based on body parser (we applied the express middle ware)
app.use(cookieParser()); //to set and get cookies with options
app.use(authRoutes);

const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose')
const socketio = require("socket.io");
const Message = require('./models/Message')
const io = socketio(server);
const mongoDB = "mongodb+srv://1tav0:Legendary1010@cluster0.qj0hn5z.mongodb.net/chat-database?retryWrites=true&w=majority";
mongoose.set('strictQuery', true).set('strictQuery', true).connect(mongoDB).then(()=>console.log('connected')).catch(err=>console.log(err));

const {addUser, getUser, removeUser} = require('./helper');
const PORT = process.env.PORT || 5000;
const Room = require('./models/Room'); //to create a room model and connect to mongoDB

app.get('/set-cookies', (req,res) => {
  res.cookie('username','Tony');
  // res.cookie('isAuthenticated',true, ); //wil display both key value pairs for username and isAuthenticated
  // res.cookie('isAuthenticated',true, {httpOnly: true}); //will display only both in localhost but on dev console only the usrname key val pair
  // res.cookie('isAuthenticated',true, {secure: true}); //isAuthenticated value will be secured and unable to be seen
  res.cookie('isAuthenticated',true, { maxAge: 24*60*60*1000}); //cookies will last only 24 hrs and then disappear 
  res.send('cookies are set');
})

app.get('/get-cookies', (req,res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
})

io.on('connection', (socket) => {
  console.log(socket.id);
  //to Load the rooms data from MongoDB
  Room.find().then(result =>{
    socket.emit('output-rooms', result)
  })

  socket.on('create-room',name =>{
    //console.log('The room name received is ', name);
    //to create room model and save to mongoDB
    const room = new Room({ name });
    room.save().then(result => {
      io.emit('room-created', result)
    })
  })
  socket.on('join',({name,room_id,user_id})=>{
    const {error,user} = addUser({
        socket_id: socket.id,
        name,
        room_id,
        user_id
    })
    socket.join(room_id);//this line to receive messages by other clients
    if(error){
      console.log('join error',error);
    }else{
      console.log('join user',user);
    }
  })
  //to receive message at the server side
  socket.on('sendMessage',(message,room_id,callback)=>{
    const user = getUser(socket.id);
    const msgToStore = {
      name:user.name,
      user_id:user.user_id,
      room_id,
      text: message
    }
    console.log('message',msgToStore); //to see msg at server side 
    //to save the message to mongoBD
    const msg = new Message(msgToStore);
    msg.save().then(result=>{
      io.to(room_id).emit('message',result); //so others in same room see msg
      callback();
    })
    // io.to(room_id).emit('message',msgToStore); //so others in same room see msg
    // callback();
  })
  socket.on('get-messages-history', room_id => {
    Message.find({ room_id }).then(result => {
        socket.emit('output-messages', result)
    })
})
  socket.on('disconnect', ()=>{
    const user = removeUser(socket.id);
  })
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});