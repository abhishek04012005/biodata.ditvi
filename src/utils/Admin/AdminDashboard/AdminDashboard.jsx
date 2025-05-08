import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminDashboard.css';
import Loader from '../../Loader/Loader';
import AdminHeader from '../AdminHeader/AdminHeader';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import STATUS_STEPS from '../../../JSON/statusConstant'



const AdminDashboard = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requests, searchQuery, sortConfig]);



    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('user_requests')
                .select(`
                    id,
                    created_at,
                    request_number,
                    in_production,
                    deleted,
                    profile_url,
                    biodata_details,
                    personal_data,
                    professional_data,
                    education_data,
                    family_data,
                    contact_data,
                    name,
                    status
                `)
                .eq('deleted', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }


    };




    const filterAndSortRequests = () => {
        let filtered = [...requests];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(request =>
            // Search by name from biodata_details
            (request.biodata_details?.guestName?.toLowerCase().includes(query) ||
                // Search by request number
                request.request_number?.toString().includes(query))
            );
        }

        filtered.sort((a, b) => {
            if (sortConfig.key === 'created_at') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at);
            } else if (sortConfig.key === 'name') {
                // Updated name sorting to use biodata_details
                const nameA = a.biodata_details?.guestName?.toLowerCase() || '';
                const nameB = b.biodata_details?.guestName?.toLowerCase() || '';
                return sortConfig.direction === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            } else if (sortConfig.key === 'request_number') {
                return sortConfig.direction === 'asc'
                    ? (a.request_number || 0) - (b.request_number || 0)
                    : (b.request_number || 0) - (a.request_number || 0);
            }
            return 0;
        });

        setFilteredRequests(filtered);
    };

    const moveToProduction = async (requestData) => {
        console.log("requestData", requestData);
        try {
            const { error: productionError } = await supabase
                .from('production_requests')
                .insert([{
                    name: requestData.name,
                    personal_data: requestData.personal_data,
                    professional_data: requestData.professional_data,
                    education_data: requestData.education_data,
                    family_data: requestData.family_data,
                    contact_data: requestData.contact_data,
                    profile_url: requestData.profile_url,
                    original_request_id: requestData.id,
                    request_number: requestData.request_number,
                    biodata_details: requestData.biodata_details
                }]);
    
            if (productionError) throw productionError;
    
        } catch (error) {
            console.error('Error moving to production:', error);
            alert('Failed to move to production');
        }
    };


    const getLatestStatus = (statusArray) => {
        // console.log("statusArray", statusArray);
        if (!Array.isArray(statusArray) || statusArray.length === 0) {
            return 'Pending';
        }

        // Find the status with the highest status_number
        const latestStatus = statusArray.reduce((latest, current) => {
            return (current.status_number > latest.status_number) ? current : latest;
        });

        return latestStatus.status || 'Pending';
    };

    const handleMoveForward = async (requestId, currentStatus) => {
        const currentIndex = STATUS_STEPS.findIndex(step => step.label === currentStatus);
        
        if (currentIndex < STATUS_STEPS.length - 1) {
            const newStatus = STATUS_STEPS[currentIndex + 1].label;
            const currentDate = new Date().toISOString();
            
            // Find the request to get its current status array
            const request = requests.find(r => r.id === requestId);
            const currentStatusArray = request?.status || [];
            
            const statusUpdate = {
                status: newStatus,
                status_number: currentStatusArray.length > 0 
                    ? Math.max(...currentStatusArray.map(s => s.status_number)) + 1 
                    : 1,
                updated_at: currentDate
            };

            if(currentIndex === 0) moveToProduction(request);
    
            try {
                const { error } = await supabase
                    .from('user_requests')
                    .update({
                        status: [...currentStatusArray, statusUpdate]
                    })
                    .eq('id', requestId);
    
                if (error) throw error;
                await fetchRequests();
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Failed to update status');
            }
        }
    };
    
    const handleMoveBackward = async (requestId, currentStatus) => {
        const currentIndex = STATUS_STEPS.findIndex(step => step.label === currentStatus);
    
        if (currentIndex > 0) {
            // Find the request to get its current status array
            const request = requests.find(r => r.id === requestId);
            let currentStatusArray = request?.status || [];
    
            if (currentStatusArray.length > 0) {
                // Remove the latest status
                currentStatusArray.pop();
    
                // If there are still statuses left, update the timestamp of the last one
                if (currentStatusArray.length > 0) {
                    const lastStatus = currentStatusArray[currentStatusArray.length - 1];
                    lastStatus.updated_at = new Date().toISOString();
                }
    
                try {
                    const { error } = await supabase
                        .from('user_requests')
                        .update({
                            status: currentStatusArray
                        })
                        .eq('id', requestId);
    
                    if (error) throw error;
                    await fetchRequests();
                } catch (error) {
                    console.error('Error updating status:', error);
                    alert('Failed to update status');
                }
            }
        }
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
            <AdminHeader />

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
                                placeholder="Search by name or request no."
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

                                    <th onClick={() => handleSort('name')}>
                                        Name {sortConfig.key === 'name' && <SortIcon />}
                                    </th>
                                    <th>Mobile Number</th>
                                    <th onClick={() => handleSort('created_at')}>
                                        Created Date {sortConfig.key === 'created_at' && <SortIcon />}
                                    </th>

                                    <th>Status</th>

                                    <th>Status Action</th>

                                    <th>Preview</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.request_number}</td>

                                        <td>{request.biodata_details?.guestName || 'Unnamed'}</td>

                                        <td>{request.biodata_details?.mobileNumber || 'No Mobile Number'}</td>
                                        <td>{formatDate(request.created_at)}</td>


                                        {/* <td>
                                            <span className={`status-badge ${request.in_production ? 'in-production' : 'pending'}`}>
                                                {request.in_production ? 'In Production' : 'Pending'}
                                            </span>
                                        </td> */}





                                        <td>
                                            {getLatestStatus(request.status)}

                                        </td>

                                        <td className="status-actions">
                                            <button
                                                className="action-btn backward"
                                                onClick={() => handleMoveBackward(request.id, getLatestStatus(request.status))}
                                                disabled={getLatestStatus(request.status) === 'Request Received'}
                                            >
                                                <ArrowBackIcon />
                                            </button>
                                            <button
                                                className="action-btn forward"
                                                onClick={() => handleMoveForward(request.id, getLatestStatus(request.status))}
                                                disabled={getLatestStatus(request.status) === 'Request Fulfilled'}
                                            >
                                                <ArrowForwardIcon />
                                            </button>
                                        </td>


                                        <td>
                                            <Link to={`/request/${request.id}`} className="view-btn">
                                                Preview
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