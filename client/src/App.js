import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import { UserContext } from './UserContext';
import Chat from './components/chat/Chat';
import Home from './components/home/Home';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => { //to verify the user with the jwt token
    const verifyUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/verifyuser', {
                credentials:'include',
                headers: {'Content-Type':'application/json'}
      });
      const data = await res.json();
      setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
    verifyUser();
  }, [])
  return (
    <Router>
      <div className="App">  
        <UserContext.Provider value={{user,setUser}}>
          <Navbar/>
          <Routes>
            {/* these are the routes it goes to whem u click a button in the react app */}
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/chat/:room_id/:room_name" element={<Chat/>} />
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
