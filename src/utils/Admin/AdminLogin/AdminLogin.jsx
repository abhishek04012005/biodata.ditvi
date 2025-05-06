import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext/AdminContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { loginAdmin } = useAdmin();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');   
        setLoading(true);

        try {
            const result = await loginAdmin(credentials.username, credentials.password);
            if (result.success) {
                navigate('/admin/dashboard');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <h2>Admin Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({
                                ...credentials,
                                username: e.target.value
                            })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={credentials.password}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    password: e.target.value
                                })}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
               
            </div>
        </div>
    );
};

export default AdminLogin;