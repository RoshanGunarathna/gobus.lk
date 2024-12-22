import React, { useState, useEffect } from 'react';
import '../styles/routemanagement.css';
import Sidebar from '../components/Sidebar';
import { addRoute, getRoutes, getRouteById, updateRoute, deleteRoute } from '../api/routeApi';

function RoutesManagement() {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({ routeId: '', name: '' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await getRoutes();
      if (response && response.routes) {
        setRoutes(response.routes);
      }
    } catch (error) {
      showToastMessage('Error fetching routes: ' + error.message);
    }
  };

  const handleEditClick = async (route) => {
    setIsModalOpen(true);
    setIsLoading(true);
    
    try {
      const response = await getRouteById(route._id);
      if (response && response.route) {
        setCurrentRoute(response.route);
      }
    } catch (error) {
      showToastMessage('Error fetching route details: ' + error.message);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await updateRoute(currentRoute);
      await fetchRoutes(); // Refresh the routes list
      setIsModalOpen(false);
      showToastMessage('Route updated successfully!');
    } catch (error) {
      showToastMessage('Error updating route: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteRoute(routeToDelete._id);
      await fetchRoutes(); // Refresh the routes list
      setIsDeleteDialogOpen(false);
      showToastMessage(`Route ${routeToDelete.routeId} deleted successfully!`);
    } catch (error) {
      showToastMessage('Error deleting route: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentRoute.routeId.trim()) {
      errors.routeId = 'Route ID is required.';
    }
    if (!currentRoute.name.trim()) {
      errors.name = 'Route Name is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClick = () => {
    setCurrentRoute({ routeId: '', name: '' });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleAddNewRoute = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        await addRoute(currentRoute);
        await fetchRoutes();
        setIsAddModalOpen(false);
        showToastMessage('Route added successfully!');
      } catch (error) {
        showToastMessage('Error adding route: ' + error.message);
      } finally {
        setIsLoading(false);
      }
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
      <Sidebar />
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
              {routes.map((route) => (
                <tr key={route._id}>
                  <td>{route.routeId}</td>
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
                {isLoading ? (
                  <div className="loading-spinner">Loading...</div>
                ) : (
                  <>
                    <label>
                      Route ID
                      <input
                        type="text"
                        name="routeId"
                        value={currentRoute.routeId}
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
                      <button 
                        className="update-button" 
                        onClick={handleUpdate}
                        disabled={isLoading}
                      >
                        Update
                      </button>
                      <button
                        className="cancel-buttonmdl"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
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
                    name="routeId"
                    value={currentRoute.routeId}
                    onChange={handleInputChange}
                    placeholder="Enter route ID"
                  />
                  {formErrors.routeId && (
                    <span className="error">{formErrors.routeId}</span>
                  )}
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
                  {formErrors.name && (
                    <span className="error">{formErrors.name}</span>
                  )}
                </label>
                <div className="modal-buttons">
                  <button 
                    className="add-route-new" 
                    onClick={handleAddNewRoute}
                    disabled={isLoading}
                  >
                    Add Route
                  </button>
                  <button
                    className="cancel-buttonmdl"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isLoading}
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
                <p>
                  Are you sure you want to delete the route with ID{' '}
                  {routeToDelete.routeId}?
                </p>
                <div className="modal-buttons">
                  <button 
                    className="delete-buttonmd3" 
                    onClick={confirmDelete}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isLoading}
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