const mongoose = require('mongoose');
//to create a room model and save to mongoDB
const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})
const Room = mongoose.model('room',roomSchema);
module.exports = Room;