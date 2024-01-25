import React, { useState } from 'react'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  return (
    <div className = 'bg-blue-50 h-screen flex items-center'>
        <form className='w-64 mx-auto mb-12'>
            <input type = "text" placeholder = "username" className = 'p-2 mb-2 block w-full rounded-sm' value = {username} onChange = {ev => setUsername(ev.target.value)}/>
            <input type = "password" placeholder = "password" className = 'p-2 my-2 block w-full rounded-sm' value = {password} onChange={ev => setPassword(ev.target.value)}/>
            <button className = "bg-blue-500 p-2 text-white block w-full rounded-sm">Register</button>
        </form>
    </div>
  )
}

export default Register