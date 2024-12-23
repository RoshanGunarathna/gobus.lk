import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/BusManagement.css';
import { getAllBuses, addBus, updateBus, deleteBus, getBusById } from '../api/BusApi';

function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newBus, setNewBus] = useState({ number: '', name: '', seat: 0 });
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch buses from the API
  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const fetchedBuses = await getAllBuses();
      setBuses(fetchedBuses);
    } catch (error) {
      showToastMessage('Error fetching buses: ' + (error.message || 'Unknown error'));
      setBuses([]); // Clear list on failure
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Show toast notifications
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle opening the Edit modal
  const handleEdit = async (bus) => {
    try {
      const busData = await getBusById(bus._id);
      if (busData) setModalData(busData);
    } catch (error) {
      showToastMessage('Failed to fetch bus details');
    }
  };

  // Save changes for an existing bus
  const handleSaveChanges = async () => {
    if (validateModalForm()) {
      try {
        await updateBus(modalData);
        await fetchBuses();
        setModalData(null);
        showToastMessage('Bus updated successfully!');
      } catch (error) {
        showToastMessage(error.message || 'Failed to update bus');
      }
    }
  };

  // Delete a bus
  const handleDelete = async (_id) => {
    try {
      await deleteBus(_id);
      await fetchBuses();
      setDeleteDialog(null);
      showToastMessage('Bus deleted successfully!');
    } catch (error) {
      showToastMessage(error.message || 'Failed to delete bus');
    }
  };

  // Validate the Add New Bus form
  const validateForm = () => {
    const errors = {};
    if (!newBus.number.trim()) errors.number = 'Enter a valid bus number';
    if (!newBus.name.trim()) errors.name = 'Enter a valid bus name';
    if (!newBus.seat || isNaN(newBus.seat) || newBus.seat <= 0) errors.seat = 'Enter a valid seat count';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate the Edit Modal form
  const validateModalForm = () => {
    const errors = {};
    if (!modalData.number.trim()) errors.number = 'Enter a valid bus number';
    if (!modalData.name.trim()) errors.name = 'Enter a valid bus name';
    if (!modalData.seat || isNaN(modalData.seat) || modalData.seat <= 0) errors.seat = 'Enter a valid seat count';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add a new bus
  const handleAddNewBus = async () => {
    if (validateForm()) {
      try {
        await addBus({ ...newBus, seat: parseInt(newBus.seat, 10) });
        await fetchBuses();
        showToastMessage('Bus added successfully!');
        handleCloseAddModal();
      } catch (error) {
        showToastMessage(error.message || 'Failed to add bus');
      }
    }
  };

  // Close Add Modal
  const handleCloseAddModal = () => {
    setAddModal(false);
    setNewBus({ number: '', name: '', seat: '' });
    setFormErrors({});
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="table-containerbu">
      <h1>Bus List </h1>

        <button className="add-bus-btn" onClick={() => setAddModal(true)}>Add New Bus</button>

        {isLoading ? (
          <p>Loading...</p>
        ) : buses.length === 0 ? (
          <p>No buses found</p>
        ) : (
          <table className="bus-table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Name</th>
                <th>Seat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id}>
                  <td>{bus.number}</td>
                  <td>{bus.name}</td>
                  <td>{bus.seat}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(bus)}>Edit</button>
                    <button className="delete-btn" onClick={() => setDeleteDialog(bus._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="bus-toast-unique">
            {toastMessage}
          </div>
        )}

        {/* Add New Bus Modal */}
        {addModal && (
          <div className="bus-modal-overlay-unique">
            <div className="bus-modal-unique">
              <h2>Add New Bus</h2>
              <label>
                Bus Number:
                <input
                  type="text"
                  value={newBus.number}
                  onChange={(e) => setNewBus({ ...newBus, number: e.target.value })}
                />
                {formErrors.number && <span className="bus-error-unique">{formErrors.number}</span>}
              </label>
              <label>
                Name:
                <input
                  type="text"
                  value={newBus.name}
                  onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
                />
                {formErrors.name && <span className="bus-error-unique">{formErrors.name}</span>}
              </label>
              <label>
                Seat:
                <input
                  type="number"
                  value={newBus.seat}
                  onChange={(e) => setNewBus({ ...newBus, seat: e.target.value })}
                />
                {formErrors.seat && <span className="bus-error-unique">{formErrors.seat}</span>}
              </label>
              <div className="bus-modal-buttons-unique">
                <button className="bus-save-btn-unique" onClick={handleAddNewBus}>Add</button>
                <button className="bus-close-btn-unique" onClick={handleCloseAddModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {modalData && (
          <div className="bus-modal-overlay-unique">
            <div className="bus-modal-unique">
              <h2>Edit Bus Details</h2>
              <label>
                Bus Number:
                <input
                  type="text"
                  value={modalData.number}
                  onChange={(e) => setModalData({ ...modalData, number: e.target.value })}
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                />
              </label>
              <label>
                Seat:
                <input
                  type="number"
                  value={modalData.seat}
                  onChange={(e) => setModalData({ ...modalData, seat: parseInt(e.target.value, 10) })}
                />
              </label>
              <div className="bus-modal-buttons-unique">
                <button className="bus-save-btn-unique" onClick={handleSaveChanges}>Update</button>
                <button className="bus-close-btn-unique" onClick={() => setModalData(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteDialog !== null && (
          <div className="bus-confirm-dialog-overlay-unique">
            <div className="bus-confirm-dialog-unique">
              <p>Are you sure you want to delete this bus?</p>
              <div className="bus-dialog-buttons-unique">
                <button className="bus-confirm-btn-unique" onClick={() => handleDelete(deleteDialog)}>Delete</button>
                <button className="bus-cancel-btn-unique" onClick={() => setDeleteDialog(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusManagement;
