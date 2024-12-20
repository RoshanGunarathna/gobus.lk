import React, { useState } from 'react';
import '../styles/SchedulesManagement.css';

function SchedulesManagement() {
  const initialSchedules = [
    {
      id: 'S0001',
      start: '4.00',
      end: '6.00',
      routeID: 'EX1 - 22',
      routeName: 'Mathara - Kadawatha',
      busNumber: 'NC-8552',
      seatPrice: 'RS. 500',
      seats: 54,
    },
    {
      id: 'S0002',
      start: '8.00',
      end: '10.00',
      routeID: 'EX1 - 22',
      routeName: 'Mathara - Kadawatha',
      busNumber: 'NC-8552',
      seatPrice: 'RS. 500',
      seats: 54,
    },
  ];

  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    id: '',
    start: '',
    end: '',
    routeID: '',
    routeName: '',
    busNumber: '',
    seatPrice: '',
    seats: '',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (schedule) => {
    setSelectedSchedule({ ...schedule });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleUpdate = () => {
    const updatedSchedules = schedules.map((schedule) =>
      schedule.id === selectedSchedule.id ? selectedSchedule : schedule
    );
    setSchedules(updatedSchedules);
    setIsModalOpen(false);
    setToastMessage('Update Successful!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddSchedule = () => {
    setNewSchedule({
      id: '',
      start: '',
      end: '',
      routeID: '',
      routeName: '',
      busNumber: '',
      seatPrice: '',
      seats: '',
    });
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAdd = () => {
    setSchedules([...schedules, { ...newSchedule, seats: parseInt(newSchedule.seats) }]);
    setIsAddModalOpen(false);
    setToastMessage('New Schedule Added Successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setSchedules(schedules.filter((schedule) => schedule.id !== selectedSchedule.id));
    setIsDeleteModalOpen(false);
    setToastMessage('Schedule Deleted Successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <div className="schedules-management">
      <h1>Schedules Management</h1>
      <div className="table-container">
      <button className="add-schedule-btn" onClick={handleAddSchedule}>
        Add New Schedules
      </button>
      <table className="schedules-table">
        <thead>
          <tr>
            <th>Schedule ID</th>
            <th>Start</th>
            <th>End</th>
            <th>Route ID</th>
            <th>Route Name</th>
            <th>Bus Number</th>
            <th>Seat Price</th>
            <th>Seat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.id}</td>
              <td>{schedule.start}</td>
              <td>{schedule.end}</td>
              <td>{schedule.routeID}</td>
              <td>{schedule.routeName}</td>
              <td>{schedule.busNumber}</td>
              <td>{schedule.seatPrice}</td>
              <td>{schedule.seats}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(schedule)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(schedule)}>
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
            <h2>Edit Schedule Details</h2>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Schedule ID</label>
                  <input type="text" value={selectedSchedule.id} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="text"
                    value={selectedSchedule.start}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, start: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="text"
                    value={selectedSchedule.end}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, end: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Route ID</label>
                  <input
                    type="text"
                    value={selectedSchedule.routeID}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, routeID: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Route Name</label>
                  <input
                    type="text"
                    value={selectedSchedule.routeName}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, routeName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bus Number</label>
                  <input
                    type="text"
                    value={selectedSchedule.busNumber}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, busNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Seat Price</label>
                  <input
                    type="text"
                    value={selectedSchedule.seatPrice}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, seatPrice: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Seats</label>
                  <input
                    type="number"
                    value={selectedSchedule.seats}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, seats: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
            </form>
            <div className="modal-actions">
              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button className="cancel-btn" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Schedule</h2>
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Schedule ID</label>
                  <input
                    type="text"
                    value={newSchedule.id}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, id: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="text"
                    value={newSchedule.start}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, start: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="text"
                    value={newSchedule.end}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, end: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Route ID</label>
                  <input
                    type="text"
                    value={newSchedule.routeID}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, routeID: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Route Name</label>
                  <input
                    type="text"
                    value={newSchedule.routeName}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, routeName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bus Number</label>
                  <input
                    type="text"
                    value={newSchedule.busNumber}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, busNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Seat Price</label>
                  <input
                    type="text"
                    value={newSchedule.seatPrice}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, seatPrice: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Seats</label>
                  <input
                    type="number"
                    value={newSchedule.seats}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, seats: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAdd}>
                Add
              </button>
              <button className="cancel-btn" onClick={handleAddModalClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this schedule?</p>
            <div className="modal-actions">
              <button className="cmdelete-btn" onClick={handleDeleteConfirm}>
                Delete
              </button>
              <button className="cancel-btn2" onClick={handleDeleteCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
    </div>
  );
}

export default SchedulesManagement;
