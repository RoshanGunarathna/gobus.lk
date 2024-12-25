
import '../styles/SchedulesManagement.css';
import Sidebar from '../components/Sidebar';
import { getAllSchedule, getASchedule, updateSchedule, addSchedule, deleteShedule } from '../api/scheduleApi';
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
          
    
        // Click add schedule
        const handleAddNewSchedules = async () => {
          try {
            const [routesResponse, busesResponse] = await Promise.all([getAllRoutes(), getAllBuses()]);

            setAvailableRoutes(Array.isArray(routesResponse?.data?.routes) ? routesResponse.data.routes : []);
            setAvailableBuses(Array.isArray(busesResponse) ? busesResponse : []);
            setNewSchedule({ scheduleId: '',   seatPrice: '',startTime: '',endTime: '', routeId: '', busId: '',seats: '', });
            setIsAddModalOpen(true);
          } catch (error) {
            console.error('Error loading data:', error);
            showToastMessage('Failed to load route and bus data');
            setAvailableRoutes([]);
            setAvailableBuses([]);
          }
        };
          const handleBusChange = (e) => {
          const selectedBusId = e.target.value;
          const selectedBus = availableBuses.find(bus => bus._id === selectedBusId);

          if (selectedBus) {
            setNewSchedule({ ...newSchedule, busId: selectedBusId, seats: selectedBus.seats || '',  });
          } else {
            setNewSchedule({ ...newSchedule, busId: selectedBusId, seats: '', 
            });
          }
        };

        // Add new schedule function
        const handleSaveNewSchedule = async () => {
          try {
            const formattedData = {
              _id: newSchedule._id || undefined,
              scheduleId: newSchedule.scheduleId,
              seatPrice: parseFloat(newSchedule.seatPrice),
              startTime: newSchedule.startTime,
              endTime: newSchedule.endTime,
              routeId: newSchedule.routeId,
              busId: newSchedule.busId,
              seats: parseInt(newSchedule.seats, 10),
            };

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


      // get a schedule

      const handleEditClick = async (schedule) => {
        try {
          const response = await getASchedule(schedule._id);
          const scheduleData = response.schedule;
      
          if (scheduleData) { let formattedStart = ''; let formattedEnd = '';
      
            if (scheduleData.startTime) {
              const startDate = new Date(scheduleData.startTime);
              if (!isNaN(startDate)) { formattedStart = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)  .toISOString() .slice(0, 16); }
            }

            if (scheduleData.endTime) { const endDate = new Date(scheduleData.endTime);
              if (!isNaN(endDate)) { formattedEnd = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000) .toISOString() .slice(0, 16); }
            }
      
            const [routesResponse, busesResponse] = await Promise.all([ getAllRoutes(), getAllBuses() ]);
            const routes = routesResponse?.data?.routes || [];
            const buses = busesResponse || [];

            const selectedBus = buses.find(bus => bus.number === scheduleData.busNumber);
            
            setSelectedSchedule({ 
              _id: scheduleData.
              _id,scheduleId: scheduleData.scheduleId, 
              routeID: scheduleData.routeID, 
              routeName: scheduleData.routeName, 
              busNumber: scheduleData.busNumber,
              seats: selectedBus ? selectedBus.seat : 0,
              seatPrice: scheduleData.seatPrice,
              start: formattedStart,
              end: formattedEnd,
              bookedSeats: scheduleData.bookedSeats || 0 });
      
            setRoutes(routes);
            setBuses(buses);
            setIsModalOpen(true);
      
            console.log('Selected Bus Seats:', selectedBus ? selectedBus.seat : 'No seat data');
          }
        } catch (error) {
          console.error('Error loading schedule:', error);
          showToastMessage('Faild Schedule details load ');
        }
      };
    
    //Update schedule
      const handleUpdate = async () => {
        try {
          const selectedRoute = routes.find(route => route.routeId === selectedSchedule.routeID);
          const selectedBus = buses.find(bus => bus.number === selectedSchedule.busNumber);
        
          // Convert local datetime to UTC
          const startTimeUTC = selectedSchedule.start ? 
            new Date(selectedSchedule.start).toISOString() : null;
          const endTimeUTC = selectedSchedule.end ? 
            new Date(selectedSchedule.end).toISOString() : null;
      
            const updateData = {
            _id: selectedSchedule._id,
            scheduleId: selectedSchedule.scheduleId,
            seatPrice: Number(selectedSchedule.seatPrice),
            startTime: startTimeUTC,
            endTime: endTimeUTC,
            routeId: selectedRoute._id, 
            busId: selectedBus._id     
          };
          const response = await updateSchedule(updateData);
          if (response) {
            showToastMessage('Schedule updated successfully');
            setIsModalOpen(false);
            fetchAllSchedule();
          }
        } catch (error) {
          console.error('Error updating schedule:', error);
          showToastMessage(errorMessage);
        }
      };

      // close modal
      const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSchedule(null);
      };
    
      const handleAddModalClose = () => {
        setIsAddModalOpen(false);
      };
      // delete handle
      const handleDelete = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDeleteModalOpen(true);
      };

      //Delete function
      const handleDeleteConfirm = async () => {
        try {
          await deleteShedule(selectedSchedule._id); 
          await fetchAllSchedule(); 
          setIsDeleteModalOpen(false); 
          showToastMessage('Schedule deleted successfully!');
        } catch (error) {
          console.error('Error deleting schedule:', error);
          showToastMessage('Failed to delete schedule');
        }
      };

      // delete cancel
      const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedSchedule(null);
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
                  <input 
                    type="text" 
                    value={selectedSchedule.scheduleId} 
                    onChange={(e) => {
                      if(validateScheduleId(e.target.value)) {
                        setSelectedSchedule({ ...selectedSchedule, scheduleId: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={selectedSchedule.start || ''}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, start: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={selectedSchedule.end || ''}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, end: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Route</label>
                  <select
                    value={selectedSchedule.routeID}
                    onChange={(e) => {
                      const selectedRoute = routes.find(route => route.routeId === e.target.value);
                      setSelectedSchedule({
                        ...selectedSchedule,
                        routeID: selectedRoute?.routeId || '',
                        routeName: selectedRoute?.name || '',
                      });
                    }}
                  >
                    <option value="">Select Route</option>
                    {routes.map(route => (
                      <option key={route.routeId} value={route.routeId}>
                       {route.routeId} - {route.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Bus</label>
                  <select
                    value={selectedSchedule.busNumber}
                    onChange={(e) => {
                      const selectedBus = buses.find(bus => bus.number === e.target.value);
                      setSelectedSchedule({
                        ...selectedSchedule,
                        busNumber: selectedBus?.number || '',
                        seats: selectedBus?.seat || 0,
                        name: selectedBus?.name || '',

                      });
                    }}
                  >
                    <option value="">Select Bus</option>
                    {buses.map(bus => (
                      <option key={bus.number} value={bus.number}>
                        {bus.number}  -  {bus.name}    ( {bus.seat} seats ) 
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
                    value={selectedSchedule.seatPrice}
                    onChange={(e) =>
                      setSelectedSchedule({ ...selectedSchedule, seatPrice: e.target.value })
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
                    onChange={(e) => setNewSchedule({ ...newSchedule, scheduleId: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
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
                    onChange={handleBusChange} 
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
                    onChange={(e) => setNewSchedule({ ...newSchedule, seatPrice: e.target.value })}
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
