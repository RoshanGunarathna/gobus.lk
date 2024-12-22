import React, { useState } from 'react';
import '../styles/routemanagement.css';
import Sidebar from '../components/Sidebar';

function RoutesManagement() {
  const [routes, setRoutes] = useState([
    { id: 'EX1 - 22', name: 'MATHARA - KADAWATHA' },
    { id: 'EX2 - 33', name: 'COLOMBO - KANDY' },
    { id: 'EX3 - 44', name: 'JAFFNA - GALLE' },
    { id: 'EX4 - 55', name: 'NEGOMBO - BATTICALOA' },
    { id: 'EX5 - 66', name: 'ANURADHAPURA - TRINCOMALEE' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({ id: '', name: '' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleEditClick = (route) => {
    setCurrentRoute(route);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: value });
  };

  const handleUpdate = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route.id === currentRoute.id ? currentRoute : route
      )
    );
    setIsModalOpen(false);
    showToastMessage('Route updated successfully!');
  };

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.filter((route) => route.id !== routeToDelete.id)
    );
    setIsDeleteDialogOpen(false);
    showToastMessage(`Route ${routeToDelete.id} deleted successfully!`);
  };

  const validateForm = () => {
    const errors = {};
    if (!currentRoute.id.trim()) {
      errors.id = 'Route ID is required.';
    }
    if (!currentRoute.name.trim()) {
      errors.name = 'Route Name is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClick = () => {
    setCurrentRoute({ id: '', name: '' });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleAddNewRoute = () => {
    if (validateForm()) {
      setRoutes((prevRoutes) => [...prevRoutes, currentRoute]);
      setIsAddModalOpen(false);
      showToastMessage('Route added successfully!');
    } else {
      showToastMessage('Please correct the errors in the form.');
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container">
      <Sidebar/>
    <div className="routes-management">
      <h1 className="topic">Bus Routes List</h1>
      <div className="table-containerr">
        <button className="add-route-button" onClick={handleAddClick}>
          Add New Route
        </button>
        <table className="routes-table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Route Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr key={index}>
                <td>{route.id}</td>
                <td>{route.name}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(route)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(route)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Bus Routes Details</h2>
              <label>
                Route ID
                <input
                  type="text"
                  name="id"
                  value={currentRoute.id}
                  onChange={handleInputChange}
                  disabled
                />
              </label>
              <label>
                Route Name
                <input
                  type="text"
                  name="name"
                 
                  value={currentRoute.name}
                  onChange={handleInputChange}
                />
              </label>
              <div className="modal-buttons">
                <button className="update-button" onClick={handleUpdate}>
                  Update
                </button>
                <button
                  className="cancel-buttonmdl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

               {/* Add New Route Modal */}
               {isAddModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Route</h2>
              <label>
                Route ID
                <input
                  type="text"
                  name="id"
                  value={currentRoute.id}
                  onChange={handleInputChange}
                  placeholder="Enter route ID"
                />
                {formErrors.id && <span className="error">{formErrors.id}</span>}
              </label>
              <label>
                Route Name
                <input
                  type="text"
                  name="name"
                  value={currentRoute.name}
                  onChange={handleInputChange}
                  placeholder="Enter route name"
                />
                {formErrors.name && <span className="error">{formErrors.name}</span>}
              </label>
              <div className="modal-buttons">
                <button className="add-route-new" onClick={handleAddNewRoute}>
                  Add Route
                </button>
                <button
                  className="cancel-buttonmdl"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && (
          
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete the route with ID {routeToDelete.id}?</p>
              <div className="modal-buttons">
                <button className="delete-buttonmd3" onClick={confirmDelete}>
                  Delete
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && <div className="toast-message">{toastMessage}</div>}
      </div>
    </div>
    </div>
   
  );
}

export default RoutesManagement;
