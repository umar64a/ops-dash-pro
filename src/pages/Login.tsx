import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import './login.css';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem('token', 'fake-jwt-token');
      dispatch(login());
      navigate('/dashboard');
    }
  }
  return (
    <div className="con">
      <div className="login">
        <img src="logo.png" alt="logo" />
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={!password || !username} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
