import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/BusManagement.css';


function BusManagement() {
  const [buses, setBuses] = useState([
    { id: 1, number: 'NC-5689', name: 'Niwarthana', seat: 54 },
    { id: 2, number: 'NC-1234', name: 'SuperBus', seat: 50 },
    { id: 3, number: 'NC-5678', name: 'MegaBus', seat: 60 },
  ]);

  const [modalData, setModalData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newBus, setNewBus] = useState({ number: '', name: '', seat: '' });
  const [toastMessage, setToastMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleEdit = (bus) => setModalData(bus);

  const handleCloseModal = () => setModalData(null);

  const handleSaveChanges = () => {
    setToastMessage('Successfully updated!');
    setModalData(null);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = (id) => {
    setBuses((prev) => prev.filter((bus) => bus.id !== id));
    setDeleteDialog(null);
    setToastMessage('Successfully deleted!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddNewBus = () => {
    // Validate form
    const errors = {};
    if (!newBus.number) errors.number = 'Enter bus number';
    if (!newBus.name) errors.name = 'Enter bus name';
    if (!newBus.seat || isNaN(newBus.seat) || newBus.seat <= 0) errors.seat = 'Enter valid seat count';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBuses((prev) => [
      ...prev,
      { id: Math.random(), ...newBus, seat: parseInt(newBus.seat, 10) },
    ]);
    setToastMessage('Successfully added!');
    setAddModal(false);
    setNewBus({ number: '', name: '', seat: '' });
    setFormErrors({});
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
            <tr key={bus.id}>
              <td>{bus.number}</td>
              <td>{bus.name}</td>
              <td>{bus.seat}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(bus)}>Edit</button>
                <button className="delete-btn" onClick={() => setDeleteDialog(bus.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
              <button className="bus-save-btn-unique" onClick={handleAddNewBus}>Add </button>
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
      {toastMessage && (
        <div className="bus-toast-unique">
          {toastMessage}
        </div>
      )}
    </div>
    </div>
  );
}

export default BusManagement;
