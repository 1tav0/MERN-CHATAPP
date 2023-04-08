const User = require('../models/User');
const jwt = require('jsonwebtoken'); //SON Web Token (JWT) is a compact and self-contained way for securely transmitting information between parties. It is often used to authenticate users and verify the authenticity of requests in a web application.

//function to ceate a json web token
const maxAge = 5 * 24 * 60 * 60;
const createJWT = id => {
return jwt.sign({id},'chatroom secret', {
    expiresIn: maxAge
})
}
//to get the values from the error object 
const alertError = (err) =>{ //create a separete function to display errors 
    let errors = {name:'',email:'',password:''}; //this is an error object
    //to deal with a duplicate user error 
    console.log(`error message: ${err.message}`);
    console.log(`error code: ${err.code}`);
    // console.log('err',err);
    if(err.message === 'incorrect email'){ //added for the login precondition 
        errors.email = 'This email not found';
    }
    if(err.message === 'incorrect pwd'){ //added for the login precondition 
        errors.password = 'The password is incorrect';
    }
    //to deal with a duplicate user error 
    if(err.code === 11000){
        errors.email = 'This email already registered';
        return errors;
    }
    if(err.message.includes('user validation failed')){ 
        // console.log(Object.values(err.errors));//change dislay of errors in an array of errors object 
        // Object.values(err.errors).forEach(error => { //ouputs much cleaner and just the error in the properties
        //     console.log(error.properties);
        // })
        Object.values(err.errors).forEach( ({properties}) => { //same as above just new line
            errors[properties.path] = properties.message;
        })
    }
    // // console.log(errors); //will display the error in each field of the user object 
    return errors;
}

module.exports.signup = async (req, res) => {
    //console.log('req.body', req.body); //body will be unfined because we need to add the express middleware in the index.js
    const {name,email,password} = req.body; //now wont be empty we created a model schema and app.use json to display nicely
    try {
        const user = await User.create({name,email,password}); //create a user and store an instance to return 
        const token = createJWT(user._id); //to create json web token
        res.cookie('jwt', token, {httpOnly: true, maxAge:maxAge * 1000});
        res.status(201).json({user});
    } catch (error) {
        // console.log(`error message: ${error.message}`);
        // console.log(`error code: ${error.code}`);
        // console.log(error)
        // res.status(400).send('Fail to create user');
        // res.status(400).send('Fail to create user');
        // alertError(error); //will display in the console
        // res.status(400).send('Error creating user');
        let errors = alertError(error);
        res.status(400).json({errors}); //will display inside the client side 
    }
    // res.send('signup')
}
module.exports.login = async (req, res) => {
    const {email,password} = req.body; //now wont be empty we created a model schema and app.use json to display nicely
    try {
        const user = await User.login(email,password); //delete curly brackets
        const token = createJWT(user._id); //to create json web token
        res.cookie('jwt', token, {httpOnly: true, maxAge:maxAge * 1000});
        res.status(201).json({user});
    } catch (error) {
        // console.log(`error message: ${error.message}`);
        // console.log(`error code: ${error.code}`);
        console.log(error)
        // res.status(400).send('Fail to create user');
        // res.status(400).send('Fail to create user');
        // alertError(error); //will display in the console
        // res.status(400).send('Error creating user');
        let errors = alertError(error);
        res.status(400).json({errors}); //will display inside the client side 
    }
}
//to verify the user with the jwt token
module.exports.verifyuser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'chatroom secret',async(err,decodedToken) =>{
            console.log('decoded token',decodedToken)
            if(err){
                console.log(err.message);
            }else{
                let user = await User.findById(decodedToken.id);
                res.json(user);
                next();
            }
        })
    }else{
        next();
    }
}
//to create logout api
module.exports.logout = (req, res) => {
    res.cookie('jwt',"",{maxAge:1});
    res.status(200).json({logout: true}); //will delete the jwt cookies seeing the inspect console application 
}
//to add routes and controllers to the server 