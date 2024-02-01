import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const RegisterAndLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOregister, setIsLoginOrRegister] = useState('register');


    const {setUsername : setLoggedInUsername, setId} = useContext(UserContext);
    async function handleSubmit(ev){
      ev.preventDefault(); 
      
      const url = isLoginOregister === 'register' ? '/register' : '/login';
      await axios.post(url, {username, password});
      setLoggedInUsername(username);
      setId(data.id);
    }


  return (
    <div className = 'bg-blue-50 h-screen flex items-center'>
        <form className='w-64 mx-auto mb-12' onSubmit = {handleSubmit}>
            <input type = "text" placeholder = "username" className = 'p-2 mb-2 block w-full rounded-sm' value = {username} onChange = {ev => setUsername(ev.target.value)}/>
            <input type = "password" placeholder = "password" className = 'p-2 my-2 block w-full rounded-sm' value = {password} onChange={ev => setPassword(ev.target.value)}/>
            <button className = "bg-blue-500 p-2 text-white block w-full rounded-sm">
              {isLoginOregister === 'register' ? 'Register' : 'Login'}
            </button>
            <div className = "text-center mt-2">
            {isLoginOregister === 'register' && (
              <div>
              Already a member? 
            <button onClick = {() => {
              setIsLoginOrRegister('login')
            }} >Login here</button>
              </div>

            )}

            {isLoginOregister === 'login' && (
              <div>
              Don't have an account? 
            <button onClick = {() => {
              setIsLoginOrRegister('register')
            }} >Register here</button>
              </div>
            )}
            
            </div>
        </form>
    </div>
  )
}

export default RegisterAndLoginForm;