import React from 'react'

const SignedInMenu = ({logout}) => { //if user is logged in all they can do is log out 
  return (
    <li onClick={logout}><a href="#">LogOut</a></li>
  )
}

export default SignedInMenu