import '../styles/UserManagement.css';
import Sidebar from '../components/Sidebar';
import { getAllUsers, getAUser, updateUser, deleteUser } from '../api/usersApi';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [users, setUsers] = useState([]);

  const currentUser = useSelector((state) => state.user.user); 


  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleEditClick = async (user) => {
    const userData = await handleGetAUser(user._id);
    if (userData) {
      setSelectedUser(userData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateUser(selectedUser._id, {
        name: selectedUser.name,
        email: selectedUser.email,
      });

      setUsers(
        users.map((user) =>
          user._id === selectedUser._id
            ? { ...user, name: selectedUser.name, email: selectedUser.email }
            : user
        )
      );

      setIsModalOpen(false);
      showToast('User updated successfully!');
      setSelectedUser(null);
    } catch (error) {
      console.error('Update Error:', error);
      showToast(error.message || 'Update failed');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser._id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUser._id)
      );

      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      showToast('User deleted successfully!');
    } catch (error) {
      console.error('Delete Error:', error);
      showToast(error.message || 'Delete failed');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleGetUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.users);
    } catch (err) {
      console.error('Get Users Error:', err);
      showToast(err.message || 'Get all users failed');
    }
  };

  

  const handleGetAUser = async (uid) => {
    try {
      const response = await getAUser(uid);
      return response.user;
    } catch (err) {
      console.error('Get User Error:', err);
      showToast(err.message || 'Get user failed');
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="user-management">
        <h1>Users List</h1>
        <div className="table-containeru">
          <table>
            <thead>
              <tr>
                <th>UserID</th>
                <th>User Name</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={
                    currentUser && currentUser._id === user._id
                      ? 'current-user-row'
                      : ''
                      
                  } 
                >
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit User Details</h2>
              <label>
                User Name
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                />
              </label>
              <div className="modal-actions">
                <button className="update-button" onClick={handleUpdate}>
                  Update
                </button>
                <button className="cancel-buttonm2" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete this user?</h3>
              <p>User ID: {selectedUser._id}</p>
              <p>Name: {selectedUser.name}</p>
              <div className="modal-actions">
                <button
                  className="delete-button2"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button className="cancel-button" onClick={handleDeleteCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Message */}
        {toastMessage && <div className="toast">{toastMessage}</div>}
      </div>
    </div>
  );
}

export default UserManagement;
