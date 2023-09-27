import React, {useState, useContext} from 'react'
import { UserContext } from '../../UserContext'; //to setAsUser instead of tom or john to chat in a room 
import {Navigate} from 'react-router-dom'; //to redirect to home page or whatever we want to when after clicking sign up button
// jsx to Login 
const Login = () => {
    const {user,setUser} = useContext(UserContext); //to setAsUser instead of tom or jhon when chatting in a room
    // this is to be able to use this jsx and actually save the data we enter when we Login 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    //upon clicking submit this submit handler will be to display values for each variable typed in 
    const submitHandler = async e => {
        e.preventDefault();
        setEmailError('');
        setNameError('');
        setPasswordError('');
        console.log(name,email,password) //the values stored here are shown in console when we press submit button after we type them in the app
        //to call Login api from client 
      try {
        const urlHerokuBackend = " https://mernchat-backend-12ed1a55588c.herokuapp.com";
            const res = await fetch(`${urlHerokuBackend}/login`, {
                method:'POST',
                credentials:'include',
                body:JSON.stringify({name,email,password}),
                headers: {'Content-Type':'application/json'}
            });
            const data =  await res.json();
            console.log(data)
            if(data.errors){ //to display error messages in screen when trying to login if theres any
              setNameError(data.errors.name);
              setEmailError(data.errors.email);
              setPasswordError(data.errors.password);
            }
            if(data.user){ //if theres a user we set the users data 
              setUser(data.user);
            }
        } catch (error) {
            console.log(error)
        }
    }
    if(user){ //if theres a user we redirect to the home page
      return <Navigate to="/" />
    }

  return (
   <div className="row">
    <h2>Login</h2>
  <form className="col s12" onSubmit={submitHandler}>
    <div className="row">
      <div className="input-field col s12">
        <input id="email" type="email" className="validate" 
        value = {email} onChange = {e=>setEmail(e.target.value)}
        />
        <div className="email error red-text">{emailError}</div>
        <label htmlFor="email">Email</label>
      </div>
    </div>
    <div className="row">
      <div className="input-field col s12">
        <input id="password" type="password" className="validate" 
        value = {password} onChange = {e=>setPassword(e.target.value)}
        />
        <div className="password error red-text">{passwordError}</div>
        <label htmlFor="password">Password</label>
      </div>
    </div>
    <button className="btn">Login</button>
  </form>
</div>

  )
}

export default Login