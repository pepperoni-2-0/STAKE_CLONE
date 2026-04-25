import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useWallet();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email.trim() !== '') {
      login(formData.username || formData.email.split('@')[0], formData.email);
      navigate('/');
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg-glow login-glow-1"></div>
      <div className="login-bg-glow login-glow-2"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">NEXUS</h1>
            <p className="login-subtitle">Welcome back to the ultimate gaming platform.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email <span style={{color:'#00bfff'}}>*</span></label>
              <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
            </div>

            <button type="submit" className="login-submit-btn">Sign In</button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <span>Register (Coming Soon)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
