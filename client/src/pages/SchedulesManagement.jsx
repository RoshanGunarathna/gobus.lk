
import '../styles/SchedulesManagement.css';
import Sidebar from '../components/Sidebar';
import { getAllSchedule, updateSchedule, addSchedule, deleteShedule } from '../api/scheduleApi';
import { getAllRoutes } from '../api/routeApi';
import { getAllBuses } from '../api/BusApi';
import React, { useState, useEffect } from 'react';



function SchedulesManagement() {
  const initialSchedules = [
  ];

  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ scheduleId: '', startTime: '', endTime: '', routeId: '', busId: '', seatPrice: '', seats: '' });
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [availableBuses, setAvailableBuses] = useState([]);
  
    useEffect(() => {
      fetchAllSchedule();
    }, []);

    // fetch schedule data

    const fetchAllSchedule = async () => {
      setIsLoading(true);
      try {
        const scheduleResponse = await getAllSchedule();
        const formattedSchedules = scheduleResponse.schedules.map(schedule => {
          return {
            _id: schedule._id,
            scheduleId: schedule.scheduleId,
            startTime: new Date(schedule.startTime).toLocaleString(),
            endTime: new Date(schedule.endTime).toLocaleString(),
            routeId: schedule.route?.routeId || 'N/A',
            routeName: schedule.route?.name || 'N/A',
            busNumber: schedule.bus?.number || 'N/A',
            seatPrice: schedule.seatPrice || 'N/A',
            seats: schedule.bus?.seat || 'N/A',
          };
        });

        setSchedules(formattedSchedules);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // toast msg
    const showToastMessage = (message) => {
      console.log('Showing toast:', message);
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => {setShowToast(false); setToastMessage(''); }, 3000);
    };
      
  // click add schedule
  const handleAddNewSchedules = async () => 
  {
    try {
        const [routesResponse, busesResponse] = await Promise.all([getAllRoutes(), getAllBuses()]);

        setAvailableRoutes(Array.isArray(routesResponse?.data?.routes) ? routesResponse.data.routes : []);
        setAvailableBuses(Array.isArray(busesResponse) ? busesResponse : []);
        setNewSchedule({ scheduleId: '', seatPrice: '', startTime: '',endTime: '', routeId: '', busId: '', seats: '',});
        setIsAddModalOpen(true);
    } catch (error) {
        console.error('Error loading data:', error);
        showToastMessage('Failed to load route and bus data');
        setAvailableRoutes([]);
        setAvailableBuses([]);
    }
  };

  // add new schedule function
  const handleSaveNewSchedule = async () => {
    try {
        const formattedData = {
            _id: newSchedule._id || undefined,  scheduleId: newSchedule.scheduleId, seatPrice: parseFloat(newSchedule.seatPrice),  startTime: newSchedule.startTime, endTime: newSchedule.endTime,routeId: newSchedule.routeId, busId: newSchedule.busId,  seats: parseInt(newSchedule.seats, 10), };

        const response = await addSchedule(formattedData);
        console.log('API Response:', response); 

        if (response?._id || !response) { 
            await fetchAllSchedule();
            showToastMessage('Schedule added successfully');
            setIsAddModalOpen(false);
        } else {
            showToastMessage('Failed to add schedule');
        }
    } catch (error) {
        console.error('Error adding schedule:', error);
        showToastMessage('Failed to add schedule');
    }
  };




  const handleEdit = (schedule) => {
    setSelectedSchedule({ ...schedule });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

 const handleUpdate = async () => {
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
   };


  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
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

   const handleEditClick = async (route) => {
   
  
    try {
      const response = await getASchedule(schedules._id);    
      
      if (response?.data?.schedules) {
        setCurrentRoute(response.data.schedules);
      } 
      
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching route details:', error);
      showToastMessage('Failed to fetch route details');
    }
  };

  return (
    <div className="container">
    <Sidebar />
    <div className="schedules-management">
      <div className="table-containers">
      <h1>Schedules Management</h1>
        <button className="add-schedule-btn" onClick={handleAddNewSchedules}>
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
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule._id}>
                <td>{schedule.scheduleId}</td>
                <td>{schedule.startTime}</td>
                <td>{schedule.endTime}</td>
                <td>{schedule.routeId}</td>
                <td>{schedule.routeName}</td>
                <td>{schedule.busNumber}</td>
                <td>{schedule.seatPrice}</td>
                <td>{schedule.seats}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(schedule)}>
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
                    value={newSchedule.scheduleId}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, scheduleId: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={newSchedule.startTime}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={newSchedule.endTime}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Route</label>
                  <select
                      value={newSchedule.routeId}
                      onChange={(e) => setNewSchedule({ ...newSchedule, routeId: e.target.value })}
                    >
                      <option value="">Select Route</option>
                      {Array.isArray(availableRoutes) && availableRoutes.map((route) => (
                        <option key={route._id} value={route._id}>
                          {route.routeId} - {route.name}
                        </option>
                      ))}
                    </select>

                </div>
                <div className="form-group">
                  <label>Bus</label>
                  <select
                    value={newSchedule.busId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, busId: e.target.value })}
                  >
                    <option value="">Select Bus</option>
                    {Array.isArray(availableBuses) && availableBuses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.name} - {bus.number} 
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Seat Price</label>
                  <input
                    type="number"
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
              <button className="add-btn" onClick={handleSaveNewSchedule}>
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
    </div>
  );
}

export default SchedulesManagement;
