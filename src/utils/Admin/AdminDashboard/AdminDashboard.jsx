import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../AdminContext/AdminContext';
import { supabase } from '../../config/supabase';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminDashboard.css';
import Loader from '../../Loader/Loader';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logoutAdmin, adminData } = useAdmin();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        filterAndSortRequests();
    }, [requests, searchQuery, sortConfig]);

  

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('user_requests')
                .select(`
                    *,
                    guest_details(
                        name,
                        mobile_number,
                        request_number
                    )
                `)
                .eq('deleted', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform the data to include guest details
            const transformedData = data.map(request => ({
                ...request,
                biodata_details: {
                    guestName: request.guest_details?.name,
                    mobileNumber: request.guest_details?.mobile_number,
                    requestNumber: request.guest_details?.request_number
                }
            }));

            setRequests(transformedData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortRequests = () => {
        let filtered = [...requests];

        if (searchQuery) {
            filtered = filtered.filter(request =>
                request.biodata_details?.mobileNumber?.includes(searchQuery)
            );
        }

        filtered.sort((a, b) => {
            if (sortConfig.key === 'created_at') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });

        setFilteredRequests(filtered);
    };

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };



    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('user_requests')
                .update({ deleted: true })
                .eq('id', deleteId);

            if (error) throw error;
            setRequests(prev => prev.filter(request => request.id !== deleteId));
            setShowDeleteDialog(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Failed to delete request');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (

            <Loader />
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <PersonIcon className="admin-icon" />
                    <div className="admin-info">
                        <span className="admin-welcome">Welcome,</span>
                        <h2 className="admin-name"> {adminData ? (
                                adminData.name || 'No username set'
                            ) : (
                                'Loading...'
                            )}</h2>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogoutIcon />
                    <span>Logout</span>
                </button>
            </header>

            <div className="dashboard-content">
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <DashboardIcon />
                        <div className="stat-info">
                            <h3>Total Requests</h3>
                            <p>{requests.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <PeopleIcon />
                        <div className="stat-info">
                            <h3>Active Users</h3>
                            <p>{filteredRequests.filter(r => !r.deleted).length}</p>
                        </div>
                    </div>
                    <Link to='/admin/production/' className="production-link">
                        <div className="stat-card">
                            <DescriptionIcon />
                            <div className="stat-info">

                                <h3>In Production</h3>
                                <p>{filteredRequests.filter(r => r.in_production).length}</p>
                            </div>
                        </div>
                    </Link>

                    <div className="stat-card">
                        <PeopleIcon />
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p>{filteredRequests.filter(r => !r.deleted).length}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-table-section">
                    <div className="table-header">
                        <h2>Recent Requests</h2>
                        <div className="search-bar">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search by Mobile No..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Request No.</th>
                                    <th>Profile</th>
                                    <th onClick={() => handleSort('name')}>
                                        Name {sortConfig.key === 'name' && <SortIcon />}
                                    </th>
                                    <th>Mobile Number</th>
                                    <th onClick={() => handleSort('created_at')}>
                                        Created Date {sortConfig.key === 'created_at' && <SortIcon />}
                                    </th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.request_number}</td>
                                        <td>
                                            <div className="profile-cell">
                                                <img
                                                    src={request.profile_url || '/default-profile.png'}
                                                    alt="Profile"
                                                    className="profile-thumbnail"
                                                    onError={(e) => {
                                                        e.target.src = '/default-profile.png';
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td>{request.biodata_details?.guestName || 'Unnamed'}</td>
                                        {console.log("name", request)}

                                        <td>{request.biodata_details?.mobileNumber || 'No Mobile Number'}</td>
                                        <td>{formatDate(request.created_at)}</td>
                                        <td>
                                            <span className={`status-badge ${request.in_production ? 'in-production' : 'pending'}`}>
                                                {request.in_production ? 'In Production' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/request/${request.id}`} className="view-btn">
                                                View Details
                                            </Link>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => {
                                                    setDeleteId(request.id);
                                                    setShowDeleteDialog(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showDeleteDialog && (
                <div className="delete-dialog-overlay">
                    <div className="delete-dialog">
                        <h3>Delete Confirmation</h3>
                        <p>Are you sure you want to delete this request?</p>
                        <div className="dialog-buttons">
                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteId(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-delete-btn"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;