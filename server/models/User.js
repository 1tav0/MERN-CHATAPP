const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator'); //to validate it is a correct email format
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please enter a name'] //these are custom errors
    },
    email:{
        type: String,
        required: [true,'Please enter a email'],
        unique: true,
        lowercase: true,
        validate:[isEmail, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,'The password should be atleast 6 characters long']
    }
})
//use mongoose hook to hash password value so we dont see it in mongodb object info 
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // console.log('before save', this);
    next();
})
//since mongoose doesnt have a login function like create() that we used when we signed up to create a user
userSchema.statics.login = async function(email,password){
    //check if user exists
    const user = await this.findOne({email}); //we search by email 
    if(user){ //we compare passwords
        const isAuthenticated = await bcrypt.compare(password,user.password); //comparing password user typed in and hashed password
        if(isAuthenticated){
            return user;
        }
        throw Error('incorrect pwd');
    }else{
        throw Error('incorrect email');
    }
}

// userSchema.post('save', function(doc, next){
//     console.log('after save',doc);
//     next();
// })

const User = mongoose.model('user', userSchema);
module.exports = User;