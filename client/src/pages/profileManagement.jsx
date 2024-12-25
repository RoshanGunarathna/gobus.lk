import React, { useState } from 'react';
import '../styles/profilemanagement.css';
import Sidebar from '../components/Sidebar';

const exampleUsers = [
  { id: 'B0001', name: 'testName', email: 'test@gmail.com', role: 'Commuter' },
];

function ProfileManagement() {
  const [users, setUsers] = useState(exampleUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
  };

  const handleUpdateClick = () => {
    if (updatedName && updatedEmail) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, name: updatedName, email: updatedEmail } : user
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Please fill out both fields.');
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="table-containerp">
      <h1 className="profile-heading">My Profile Details</h1>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEditClick(user)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing User Profile */}
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
              <button className="close-button" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

    
    </div>
    
  );
}

export default ProfileManagement;
