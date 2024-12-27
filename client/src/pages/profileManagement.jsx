// components/ProfileManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileManagement.css';
import Sidebar from '../components/Sidebar';
import { fetchUserApi, updateUserApi, deleteUserApi } from '../api/getUserApi';
import { logout } from '../api/authApi'; 
import { useDispatch } from 'react-redux';
import { removeUser } from '../redux/userSlice';




function ProfileManagement() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetchUserApi();
      setUserData(response.user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showToast('Failed to load user data', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
  };

  const handleUpdateClick = async () => {
    if (!updatedName || !updatedEmail) {
      showToast('Please fill out both fields.', 'error');
      return;
    }

    try {
      const updatedData = {
        name: updatedName,
        email: updatedEmail
      };

      await updateUserApi(updatedData);
      
      setUserData(prev => ({
        ...prev,
        name: updatedName,
        email: updatedEmail
      }));
      
      setSelectedUser(null);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    }
  };



  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserApi();
      showToast('Account deleted successfully', 'success');
      handleLogout();
    } catch (error) {
      showToast(error.message || 'Failed to delete account', 'error');
    } finally {
      setShowDeleteConfirm(false);
    }
  };


  const dispatch = useDispatch();
 const handleLogout = async () => {
    try {
      await logout();    
      dispatch(removeUser());
      localStorage.removeItem('accessToken');  
      navigate('/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="container">
        <Sidebar />
        <div className="table-containerp">
          <h1 className="profile-heading">My Profile Details</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Sidebar />
        <div className="table-containerp">
          <h1 className="profile-heading">My Profile Details</h1>
          <p className="error-message">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {toast.show && (
        <div className={`toast-message ${toast.type}`}>
          {toast.message}
        </div>
      )}
      
      <Sidebar />
      <div className="table-containerp">
        <h1 className="profile-heading">My Profile Details</h1>
        {userData && (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key={userData._id}>
                <td>{userData._id}</td>
                <td>{userData.name}</td>
                <td>{userData.email}</td>
                <td>{userData.role}</td>
                <td>
                  <button 
                    className="edit-button" 
                    onClick={() => handleEditClick(userData)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User Profile</h2>
            <label>User Name:</label>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <label>Email:</label>
            <input
              type="email"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
            <div className="modal-actions">
              <button className="update-button" onClick={handleUpdateClick}>Update</button>
              <button className="close-button2" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p class="p-cls">Are you sure you want to delete your account? </p>
            <p class="p-cls"> Your account will be delete</p>
            <div className="modal-actions">
              <button className="delete-buttonn" onClick={handleConfirmDelete}>Delete</button>
              <button className="close-button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileManagement;