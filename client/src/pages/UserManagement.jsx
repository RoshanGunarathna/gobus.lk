import React, { useState } from 'react';
import '../styles/UserManagement.css';
import Sidebar from '../components/Sidebar';

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 'U001', name: 'Niwarthana', email: 'Sathyanjali00@gmail.com', role: 'Admin' },
    { id: 'U002', name: 'Kamal', email: 'kamal@example.com', role: 'Admin' },
    { id: 'U003', name: 'Sunil', email: 'sunil@example.com', role: 'Admin' },
    { id: 'U004', name: 'Amara', email: 'amara@example.com', role: 'Admin' },
    { id: 'U005', name: 'Saman', email: 'saman@example.com', role: 'Admin' },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
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

  const handleUpdate = () => {
    console.log('Updated User:', selectedUser);
    setIsModalOpen(false);
    setToastMessage('User updated successfully!');
    setTimeout(() => setToastMessage(''), 3000); 
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    setToastMessage('User deleted successfully!');
    setTimeout(() => setToastMessage(''), 3000); 
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

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
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
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
            <h2>Edit User List Details</h2>
            <label>
              User ID
              <input
                type="text"
                name="id"
                value={selectedUser.id}
                onChange={handleInputChange}
              />
            </label>
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
            <label>
              User Role
              <select name="role" value={selectedUser.role} onChange={handleInputChange} className='role-select'>

                <option value="Admin">Admin</option>
                <option value="Operator">Operator</option>
                <option value="Commuter">Commuter </option>
              </select>
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
            <p>User ID: {selectedUser.id}</p>
            <p>Name: {selectedUser.name}</p>
            <div className="modal-actions">
              <button className="delete-button2" onClick={handleDeleteConfirm}>
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
