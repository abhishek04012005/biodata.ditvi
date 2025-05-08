import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Search,
    Sort,
    Visibility,
    Storage,
    Person,
    CalendarToday,
    Description
} from '@mui/icons-material';
import './ProductionDashboard.css';
import Loader from '../../Loader/Loader';
import AdminHeader from '../AdminHeader/AdminHeader';

const ProductionDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        filterAndSortRequests();
        updateStats();
    }, [requests, searchQuery, sortConfig]);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('production_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = () => {
        setStats({
            total: requests.length,
            completed: requests.filter(r => r.status === 'completed').length,
            pending: requests.filter(r => r.status === 'pending').length
        });
    };




    const filterAndSortRequests = () => {
        let filtered = [...requests];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(request =>
            // Search by name
            (request.name?.value?.toLowerCase().includes(query) ||
                // Search by request number (convert number to string for comparison)
                request.request_number?.toString().includes(searchQuery))
            );
        }

        filtered.sort((a, b) => {
            if (sortConfig.key === 'created_at') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            } else if (sortConfig.key === 'name') {
                const nameA = a.name?.value?.toLowerCase() || '';
                const nameB = b.name?.value?.toLowerCase() || '';
                return sortConfig.direction === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            } else if (sortConfig.key === 'request_number') {
                // Add sorting for request number as integer
                return sortConfig.direction === 'asc'
                    ? (a.request_number || 0) - (b.request_number || 0)
                    : (b.request_number || 0) - (a.request_number || 0);
            }
            return 0;
        });

        setFilteredRequests(filtered);
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
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
        <div className="production-dashboard">
            <AdminHeader />
            <div className="dashboard-background">
                <div className="dashboard-circle circle-1"></div>
                <div className="dashboard-circle circle-2"></div>
            </div>

            <div className="dashboard-content">
                {/* Stats Section */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <Storage className="stat-icon" />
                        <div className="stat-info">
                            <h3>Total Requests</h3>
                            <p>{stats.total}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Description className="stat-icon completed" />
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p>{stats.completed}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Description className="stat-icon pending" />
                        <div className="stat-info">
                            <h3>Pending</h3>
                            <p>{stats.pending}</p>
                        </div>
                    </div>
                </div>

                {/* Search and Table Section */}
                <div className="table-section">
                    <div className="table-header">
                        <h2>Production Queue</h2>
                        <div className="search-bar">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name or request no."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>




                    </div>

                    <div className="table-container">
                        <table className="production-table">
                            <thead>
                                <tr>
                                    <th className="profile-header">Profile</th>
                                    <th>
                                        <div onClick={() => handleSort('name')} className="sortable-header">
                                            <Person />
                                            <span>Name</span>
                                            {sortConfig.key === 'name' && (
                                                <Sort className={`sort-icon ${sortConfig.direction}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th>Request No.</th>
                                    <th>
                                        <div onClick={() => handleSort('created_at')} className="sortable-header">
                                            <CalendarToday />
                                            <span>Created Date</span>
                                            {sortConfig.key === 'created_at' && (
                                                <Sort className={`sort-icon ${sortConfig.direction}`} />
                                            )}
                                        </div>
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.id} className="table-row">
                                        <td>
                                            <div className="profile-cell">
                                                <img
                                                    src={request.profile_url || '/default-profile.png'}
                                                    alt={request.name?.value || 'Profile'}
                                                    className="profile-thumbnail"
                                                    onError={(e) => {
                                                        e.target.src = '/default-profile.png';
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td>{request.name?.value || 'Unnamed'}</td>
                                        <td>{request.request_number}</td>
                                        <td>{formatDate(request.created_at)}</td>
                                        <td className="action-buttons">
                                            <Link
                                                to={`/production/request/${request.id}`}
                                                className="action-btn details-btn"
                                            >
                                                Show Details
                                            </Link>
                                            <Link
                                                to={`/admin/production/preview/${request.id}`}
                                                className="action-btn preview-btn"
                                            >
                                                <Visibility />
                                                Preview
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionDashboard;