import React, { useState, useEffect } from 'react';
import '../styles/routemanagement.css';
import Sidebar from '../components/Sidebar';
import { addRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute } from '../api/routeApi';

function RoutesManagement() {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState({ _id:'', routeId: '', name: '' });
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
    setIsLoading(true);
    try {
      const response = await getAllRoutes();
     
      
      if (response?.data?.routes) {
        setRoutes(response.data.routes);
      } else if (response?.data) {
        setRoutes(response.data);
      } else {
        showToastMessage('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      showToastMessage('Failed to fetch routes');
    } finally {
      setIsLoading(false);
    }
  };

 const handleEditClick = async (route) => {
 

  try {
    const response = await getRouteById(route._id);    
    
    if (response?.data?.route) {
      setCurrentRoute(response.data.route);
    } 
    
    setIsModalOpen(true);
  } catch (error) {
    console.error('Error fetching route details:', error);
    showToastMessage('Failed to fetch route details');
  }
};
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: value });
    // Clear the error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
    
        
        // Create update data object
        const updateData = {
          _id: currentRoute._id,
          routeId: currentRoute.routeId,
          name: currentRoute.name
        };
        
       
        
        await updateRoute(updateData);
        await fetchRoutes();
        setIsModalOpen(false);
        showToastMessage('Route updated successfully!');
      } catch (error) {
        console.error('Error updating route:', error);
        showToastMessage('Failed to update route');
      }
    }
  };
  

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRoute(routeToDelete._id);
      await fetchRoutes();
      setIsDeleteDialogOpen(false);
      showToastMessage(`Route deleted successfully!`);
    } catch (error) {
      console.error('Error deleting route:', error);
      showToastMessage('Failed to delete route');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentRoute.routeId?.trim()) {
      errors.routeId = 'Route ID is required.';
    }
    if (!currentRoute.name?.trim()) {
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
        await addRoute(currentRoute);
        await fetchRoutes();
        setIsAddModalOpen(false);
        showToastMessage('Route added successfully!');
      } catch (error) {
        console.error('Error adding route:', error);
        showToastMessage('Failed to add route');
      }
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
              {isLoading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Loading...</td>
                </tr>
              ) : routes.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No routes found</td>
                </tr>
              ) : (
                routes.map((route) => (
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
                ))
              )}
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
                    name="routeId"
                    value={currentRoute.routeId || ''}
                    onChange={handleInputChange}
                    disabled
                  />
                </label>
                <label>
                  Route Name
                  <input
                    type="text"
                    name="name"
                    value={currentRoute.name || ''}
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
                <p>
                  Are you sure you want to delete the route with ID{' '}
                  {routeToDelete?.routeId}?
                </p>
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