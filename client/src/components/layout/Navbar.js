import React, {useContext} from 'react'
import { UserContext } from '../../UserContext';//so we can copy from the chat component
import SignedInMenu from './SignedInMenu';//for conditional rendering
import SignedOutMenu from './SignedOutMenu'; //also for condional rendering 
// import 'materialize-css/dist/css/materialize.min.css';
// import 'materialize-css/dist/js/materialize.min.js';

//to create 
const Navbar = () => {
    const {user,setUser} = useContext(UserContext);
    const logout = async () =>{
        try {
            const res = await fetch('http://localhost:5000/logout',{
            credentials: 'include',
            });
            const data = res.json;
            console.log('logout data', data);
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    }
    const menu = user?<SignedInMenu logout={logout}/>:<SignedOutMenu/> //for conditional rendering aka redirecting 
    return (
        <>
            <nav className="green">
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Chat</a>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {menu}
                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-demo">
                {menu}
            </ul>
        </>

    )
}

export default Navbar
