import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/BusManagement.css';
import { getAllBuses, addBus, updateBus, deleteBus , getBusById} from '../api/BusApi';

function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newBus, setNewBus] = useState({ _id: '', number: '', name: '', seat: 0 });
  const [toastMessage, setToastMessage] = useState('');
   const [showToast, setShowToast] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
 


  
  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const busses = await getAllBuses();
      setBuses(busses);
    } catch (error) {
      console.error('Error fetching buses:', error);
      setToastMessage('Error: ' + (error.message || 'Failed to fetch buses'));
      setBuses([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchBuses();
  }, []);

  // const handleEdit = (bus) => setModalData(bus);

   const handleEdit = async (bus) => {
   
   
  
    try {
      const busData = await getBusById(bus._id);
    
      
      if (busData) {
        setModalData(busData);
      } 
    } catch (error) {
      console.error('Error fetching bus details:', error);
      showToastMessage('Failed to fetch bus details');
    }
  };

  
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCloseModal = () => setModalData(null);

  const handleSaveChanges = async () => {
      if (validateForm()) {
        try {
        
          // Create update data object
          const updateData = {
            _id: modalData._id,
            number: modalData.number, 
             seat: modalData.seat,
            name: modalData.name
          };
          
   
          
          await updateBus(updateData);
          await fetchBuses();
        setModalData(null);
        setToastMessage('Successfully updated!');
        } catch (error) {
          console.error('Error updating route:', error);
          setToastMessage(error.message || 'Failed to update bus');
        }
       
      }
      setTimeout(() => setToastMessage(''), 3000);
    };

  const handleDelete = async (_id) => {
    try {
      await deleteBus(_id);
      await fetchBuses();
      setDeleteDialog(null);
      setToastMessage('Successfully deleted!');
    } catch (error) {
      console.error('Error deleting bus:', error);
      setToastMessage(error.message || 'Failed to delete bus');
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  const validateForm = () => {
    const errors = {};
    if (!newBus.number) errors.number = 'Enter bus number';
    if (!newBus.name) errors.name = 'Enter bus name';
    if (!newBus.seat || isNaN(newBus.seat) || newBus.seat <= 0) errors.seat = 'Enter valid seat count';
    return errors;
  };

  const handleAddNewBus = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await addBus({ ...newBus, seat: parseInt(newBus.seat, 10) });
      await fetchBuses();
      setToastMessage('Successfully added!');
      handleCloseAddModal();
    } catch (error) {
      console.error('Error adding bus:', error);
      setToastMessage(error.message || 'Failed to add bus');
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCloseAddModal = () => {
    setAddModal(false);
    setNewBus({ number: '', name: '', seat: '' });
    setFormErrors({});
  };

  return (
    <div className="container">
      <Sidebar />
      <h1>Bus List</h1>
      <div className="table-containerbu">
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
                  onChange={(e) => setModalData({ ...modalData, seat: parseInt(e.target.value) })}
                />
              </label>
              <div className="bus-modal-buttons-unique">
                <button className="bus-save-btn-unique" onClick={handleSaveChanges}>Update</button>
                <button className="bus-close-btn-unique" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
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
                  placeholder="Enter bus number"
                  value={newBus.number}
                  onChange={(e) => setNewBus({ ...newBus, number: e.target.value })}
                />
                {formErrors.number && <span className="bus-error-unique">{formErrors.number}</span>}
              </label>
              <label>
                Name:
                <input
                  type="text"
                  placeholder="Enter bus name"
                  value={newBus.name}
                  onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
                />
                {formErrors.name && <span className="bus-error-unique">{formErrors.name}</span>}
              </label>
              <label>
                Seat:
                <input
                  type="number"
                  placeholder="Enter seat count"
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


        {/* Toast Notification */}
        {showToast && ( <div className="bus-toast-unique">  {toastMessage}  </div>  )}
      </div>
    </div>
  );
}
export default BusManagement;