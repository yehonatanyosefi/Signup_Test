import React, { useState } from 'react'

//TODO redo
export function Login() {
  const [user, setUser] = useState({ username: '', password: '' })
  function handleSubmit() {
    // userService.login(user)
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={(ev) => setUser({...user, username: ev.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(ev) => setUser({...user, password: ev.target.value })}
        />
        <button>Login</button>
      </form>
    </div>
  )
}
