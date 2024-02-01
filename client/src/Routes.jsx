import React, { useContext } from 'react'
import RegisterAndLoginForm from './RegisterAndLoginForm'
import { UserContext } from './UserContext'

const Routes = () => {

    const {username, id} = useContext(UserContext);

    if(username){
        return "logged in! "+ username;
    }
    return (
        <RegisterAndLoginForm/>
    )
}

export default Routes;