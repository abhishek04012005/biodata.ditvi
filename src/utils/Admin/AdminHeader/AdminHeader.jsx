import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../AdminContext/AdminContext';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import './AdminHeader.css';

const AdminHeader = () => {
    const navigate = useNavigate();
    const { logoutAdmin, adminData } = useAdmin();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <PersonIcon className="admin-icon" />
                <div className="admin-info">
                    <span className="admin-welcome">Welcome,</span>
                    <h2 className="admin-name">
                        {adminData ? (adminData.name || 'No username set') : 'Loading...'}
                    </h2>
                </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
            </button>
        </header>
    );
};

export default AdminHeader;