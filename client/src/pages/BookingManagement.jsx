import React, { useState } from "react";
import "../styles/bookingmanagement.css";
import Sidebar from "../components/Sidebar";
import { fetchUserApi } from '../api/getUserApi';
import  {  useEffect } from 'react';
import { getUserBookings,addUserBookings, commuterdeletebooking } from '../api/commuterBokkingApi';
import { getAllRoutes } from '../api/routeApi';
import { getAllSchedule } from '../api/scheduleApi';
import { getCommuter, addOperatorBookings,operatordeletebooing,getAllBooking, updateBookingAPI,getABooking } from '../api/bookingApi';

const BookingList = () => {
      const [bookings, setBookings] = useState([ ]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isAddModalOpen, setIsAddModalOpen] = useState(false);
      const [selectedBooking, setSelectedBooking] = useState({
        seats: '',
        paySlipNumber: '',
        scheduleId: '',
        commuterId: '',
        schedule_id: '',
        booking_id: '',
        bookingId: '',
        routeName: '',
        commuterName: '',
        seatPrice: 0
      });
      
      const [showToast, setShowToast] = useState(false);
      const [deleteDialog, setDeleteDialog] = useState(false);
      const [deleteDialogc, setDeleteDialogc] = useState(false);
      const [deleteBookingId, setDeleteBookingId] = useState(null);
      const [userData, setUserData] = useState(null);
      const [toastMessage, setToastMessage] = useState('');
      const [routes, setRoutes] = useState([]);
      const [schedules, setSchedule] = useState([]);
      const [selectedPrice, setSelectedPrice] = useState('');
      const [selectedAvailability, setSelectedAvailability] = useState('');
      const [formData, setFormData] = useState({ seats: '', paySlipNumber: '', scheduleId: '', commuterId: '' });
      const [isCommuter, setIsCommuter] = useState(false);
      const [isOperator, setIsOperator] = useState(false);
      const [commuters, setCommuters] = useState([]);
      const [bookingDetails, setBookingDetails] = useState({ commuterId: '', scheduleId: '', seats: '', paySlipNumber: '' });
      const [availableSeats, setAvailableSeats] = useState(0);
      const [scheduleList, setScheduleList] = useState([]);
      const [commuterList, setCommuterList] = useState([]);
      
      
      useEffect(() => {
        fetchUserData();
      }, []);

      
      // Fetch user data and role
        const fetchUserData = async () => {
          try {
            const response = await fetchUserApi();
            setUserData(response.user);
            const userRole = response.user.role;

            if (userRole === 'operator') {
              setIsOperator(true); 
              await fetchAllBookings();
            } else if (userRole === 'commuter') {
              setIsCommuter(true); 
              setFormData(prevState => ({ ...prevState, commuterId: response.user._id }));
              await fetchUserBookings(response.user._id);
            }

          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error fetching data';
            showToastMessage(errorMessage, 'error');
            console.error("fetching error:", error);
          }
        };
  

      // fetch all booking for operator
      const fetchAllBookings = async () => {
        try {
          const bookingsResponse = await getAllBooking();
          setBookings(bookingsResponse.bookings);
          
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
          console.log('Error fetching bookings:', errorMessage);
          showToastMessage(errorMessage, 'error');
        }
        
      };


      // fetch user booking 
      const fetchUserBookings = async (userId) => {
        try {
          const bookingsResponse = await getUserBookings(userId);
          if (bookingsResponse.bookings && bookingsResponse.bookings.length > 0) {
            setBookings(bookingsResponse.bookings);
          } else {
            showToastMessage('No bookings found for your account', 'info');
          }
        } catch (err) {
          console.log('Error fetching user bookings:', err.message);
          showToastMessage('Failed to fetch bookings', 'error');
        }
      };
  
 
      // open add modal for commuter
      const openAddModalcommuter = async () => {
        setIsAddModalOpen(true);
        setFormData({
          seats: '',
          paySlipNumber: '',
          scheduleId: '',
          commuterId: ''
        });
      
        try {
          const response = await getAllRoutes();
          const scheduleResponse = await getAllSchedule();
          
          setRoutes(response.data?.routes || []);
          setSchedule(scheduleResponse.schedules || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


      //open add modal for operator
      const openAddModal = async () => {
        setIsAddModalOpen(true);
      
        try {
          const response = await getAllRoutes();
          const scheduleResponse = await getAllSchedule();
          const commuterResponse = await getCommuter();
          
          setRoutes(response.data?.routes || []);
          setSchedule(scheduleResponse.schedules || []);
          setCommuters(commuterResponse.commuters || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


      // add new booking for commuter
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const response = await addUserBookings({
            seats: parseInt(formData.seats),
            paySlipNumber: formData.paySlipNumber,
            scheduleId: formData.scheduleId,
            commuterId: formData.commuterId
          });
          
          if (response?._id || !response) {
            showToastMessage('Booking added successfully!');
            fetchUserBookings();
            setIsAddModalOpen(false);
            setFormData({
              seats: '',
              paySlipNumber: '',
              scheduleId: '',
              commuterId: ''
            });
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Error adding booking';
          showToastMessage(errorMessage, 'error');    
          console.error("Booking error:", error);
        }
      };


      // add new booking for operator
      const addOperatorSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
          if (!bookingDetails.commuterId || !bookingDetails.scheduleId || !bookingDetails.seats || !bookingDetails.paySlipNumber) {
            showToastMessage('Fill the details');
            return;
          }

          const response = await addOperatorBookings(bookingDetails);
          
          if (response?._id || !response) {
            showToastMessage('Booking added successfully!');
            fetchAllBookings();
            closeAddModal();
          
          }
        } catch (error) {
          showToastMessage(error.message || 'Error adding booking');
        }
      };
      
      // schedule change for commuter
      const handleScheduleChangec = (scheduleId) => {
        const selectedSchedule = schedules.find(schedule => schedule._id === scheduleId);
        if (selectedSchedule) {
          const totalSeats = selectedSchedule.bus.seat;
          const bookedSeats = selectedSchedule.bookedSeats;
          
          setSelectedPrice(selectedSchedule.seatPrice);
          setSelectedAvailability(totalSeats - bookedSeats);
          setFormData(prev => ({
            ...prev,
            scheduleId: scheduleId  
          }));
        }
      };

     // schedule change for operator
      const handleScheduleChange = (scheduleId) => {
        const selectedSchedule = schedules.find(schedule => schedule._id === scheduleId);
        if (selectedSchedule) {
          const totalSeats = selectedSchedule.bus.seat;
          const bookedSeats = selectedSchedule.bookedSeats;
          
          setSelectedPrice(selectedSchedule.seatPrice);
          setSelectedAvailability(totalSeats - bookedSeats);
          setBookingDetails(prev => ({
            ...prev,
            scheduleId: scheduleId,
            seats: '' 
          }));
        }
      };


      //input change for  commuter
      const handleInputChangec = (e) => {
        const { name, value } = e.target;
        
        if (!value.trim()) {
          setFormData(prevData => ({
            ...prevData,
            [name]: ''
          }));
          return;
        }
        if (name === 'seats') {
          const numValue = parseInt(value);
          
          setFormData(prevData => ({
            ...prevData,
            [name]: numValue
          }));
          return;
        }

        if (name === 'paySlipNumber') {
          const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
          setFormData(prevData => ({
            ...prevData,
            [name]: cleanValue
          }));
          return;
        }
      };
    
      //input change for  operator

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'seats') {
          const seatValue = parseInt(value);
          if (!isNaN(seatValue) && seatValue >= 1 && seatValue <= selectedAvailability) {
            setBookingDetails(prev => ({
              ...prev,
              [name]: seatValue
            }));
          }
        } else {
          setBookingDetails(prev => ({
            ...prev,
            [name]: value
          }));
        }
      };

      const openModal = (booking) => {
        setSelectedBooking({ ...booking });
        setIsModalOpen(true);
      };

      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
      };

      // for operator
      const handleDelete = (booking) => {
        setSelectedBooking(booking);
        setDeleteDialog(true);
      };


      // for commuter
      const handleDeletec = (booking) => {
        setSelectedBooking(booking);
        setDeleteDialogc(true);
      };
     
     //Delete function for commuter
      const handleDeleteConfirm = async () => {
        try {
          await commuterdeletebooking(selectedBooking); 
          await fetchUserBookings(); 
          setDeleteDialogc(false); 
          showToastMessage('Booking deleted successfully!');
        } catch (error) {
          console.error('Error deleting booking:', error);
          showToastMessage('Failed to delete booking');
        }
      };

      // Delete function for operator
      const handleDeleteConfirmo = async () => {
        try {
          await operatordeletebooing(selectedBooking);
          await fetchAllBookings();
          setDeleteDialog(false);
          showToastMessage('Booking deleted successfully!');
        } catch (error) {
          console.error('Error deleting booking:', error);
          showToastMessage(error.message || 'Failed to delete booking');
        }
      };
      
        // toast msg
        const showToastMessage = (message) => {
          console.log('Showing toast:', message);
          setToastMessage(message);
          setShowToast(true);
          setTimeout(() => {setShowToast(false); setToastMessage(''); }, 3000);
        } 

        const cancelDelete = () => { setDeleteDialog(false); setDeleteBookingId(null); setDeleteDialogc(false); };
          
        const closeAddModal = () => {
          setBookingDetails({ commuterId: '',  scheduleId: '', seats: '',  paySlipNumber: '' });      
          setSelectedAvailability('');
          setSelectedPrice('');
          setIsAddModalOpen(false);
        };


        const openModaledit = async (bookingId) => {
          try {
            const bookingResponse = await getABooking(bookingId);
            console.log("Original booking data:", bookingResponse);
            
            const booking = bookingResponse.data?.booking || bookingResponse.booking || bookingResponse;
            
            const response = await getAllSchedule();
            const scheduleData = response.data || response.schedules || response;
            setScheduleList(scheduleData);
            
            const commuterResponse = await getCommuter();
            setCommuterList(commuterResponse.data || commuterResponse.commuters || commuterResponse);
            
            const currentSchedule = Array.isArray(scheduleData) && booking?.scheduleData 
              ? scheduleData.find(schedule => schedule.scheduleId === booking.scheduleData.scheduleId) 
              : null;
            
            if (currentSchedule) {
              const totalSeats = currentSchedule.bus.seat || 0;
              const bookedSeats = currentSchedule.bookedSeats || 0;
              const availableSeats = totalSeats - bookedSeats;
              
              setSelectedPrice(currentSchedule.seatPrice || 0);
              setAvailableSeats(availableSeats + parseInt(booking.seats || 0));
            }
            
            if (booking) {
              setSelectedBooking({
                bookingId: booking.bookingId || booking._id, 
                booking_id: booking._id, 
                scheduleId: booking.scheduleData?.scheduleId || booking.scheduleId,
                schedule_id: currentSchedule?._id,
                commuterName: booking.commuterData?.name || booking.commuterName,
                commuterId: booking.commuterData?._id || booking.commuterId,
                seats: booking.seats || 0,
                paySlipNumber: booking.paySlipNumber || "",
                routeName: booking.scheduleData?.route?.name || booking.routeName,
              });
            }
            
            setIsModalOpen(true);
          } catch (error) {
            console.error("Error loading data:", error);
            setToastMessage("Error loading booking data");
            setShowToast(true);
          }
        };

        // edit schedule handdler
        const handleInputChangeedit = (e) => {
          const { name, value } = e.target;
          
          if (name === 'scheduleId') {
            const selectedSchedule = scheduleList.find(s => s.scheduleId === value);
            if (selectedSchedule) {
              const totalSeats = selectedSchedule.bus.seat;
              const bookedSeats = selectedSchedule.bookedSeats;
              const availableSeats = totalSeats - bookedSeats;
              
              setSelectedPrice(selectedSchedule.seatPrice);
              setAvailableSeats(availableSeats);
              
              setSelectedBooking(prev => ({
                ...prev,
                scheduleId: value,
                schedule_id: selectedSchedule._id, // Store MongoDB _id
                routeName: selectedSchedule.route.name,
                seatPrice: selectedSchedule.seatPrice
              }));
              return;
            }
          }
          
          setSelectedBooking(prev => ({
            ...prev,
            [name]: value
          }));
        };


         const updateBooking = async () => {
          try {
            console.log("Selected booking before update:", selectedBooking);
            
            if (!selectedBooking.booking_id || !selectedBooking.schedule_id) {
              throw new Error('Required booking or schedule ID is missing');
            }
            
            const booking = {
              id: selectedBooking.booking_id,  
              scheduleId: selectedBooking.schedule_id, 
              commuterId: selectedBooking.commuterId,
              seats: parseInt(selectedBooking.seats),
              paySlipNumber: selectedBooking.paySlipNumber,
            };
        
            console.log("Sending update request with data:", booking);
            const updatedData = await updateBookingAPI(booking);
            console.log("Update response:", updatedData);
            
            showToastMessage('Booking updated successfully!', 'success');
            closeModaledit();
            fetchAllBookings();
          } catch (error) {
            console.error('Error updating booking:', error.message);
            showToastMessage(`Error: ${error.message}`, 'error');
          }
        };   

        const closeModaledit = () => {
          setIsModalOpen(false);
          setSelectedBooking({
            bookingId: '',
            scheduleId: '',
            commuterName: '',
            commuterId: '',
            seats: '',
            paySlipNumber: '',
            routeName: ''
          });
        };
       
  return (
    <div className="container">
      <Sidebar />
    <div>

    {/* Commuter table */}
    {isCommuter && (
      <div className="table-containerb">
        <h1>Booking List</h1>
        <button className="add-booking-btn" onClick={openAddModalcommuter}> Add New Booking </button>
         <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Start</th>
              <th>End</th>
              <th>Route ID</th>
              <th>Route Name</th>
              <th>Bus Number</th>
              <th>Schedule ID</th>
              <th>Seat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingId}</td>
                  <td>{new Date(booking.scheduleData.startTime).toLocaleString()}</td>
                  <td>{new Date(booking.scheduleData.endTime).toLocaleString()}</td>
                  <td>{booking.scheduleData.route.routeId}</td>
                  <td>{booking.scheduleData.route.name}</td>
                  <td>{booking.scheduleData.bus.number}</td>
                  <td>{booking.scheduleData.scheduleId}</td>
                  <td>{booking.seats}</td>
                  <td>
                    
                    <button
                      className="delete-btn"
                      onClick={() => handleDeletec(booking)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
        <tr>
          <td colSpan="9">No bookings available</td>
        </tr>
         )}
    </tbody>
      </table>
        </div>
      )}

      {/* Operator table */}
  	  {isOperator && (
      <div className="table-containerb">
        <h1>Booking List</h1>
        <button className="add-booking-btn" onClick={openAddModal}> Add New Booking </button>
         <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Schedule ID</th>
              <th>Commuter name</th>  
              <th>Book Date</th>
              <th>Route Name</th>
              <th>Seat</th>
              <th>slip Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.scheduleData.scheduleId}</td>
                  <td>{booking.commuterData.name}</td>
                  <td>{booking.addedDate ? new Date(booking.addedDate).toISOString().split("T")[0] : "Not Available"}</td>
                  <td>{booking.scheduleData.route.name}</td>
                  <td>{booking.seats}</td>
                  <td>{booking.paySlipNumber}</td>
                  <td>
                    <button className="edit-btn" onClick={() => openModaledit(booking)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(booking)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
        <tr>
          <td colSpan="9">No bookings available</td>
        </tr>
         )}
    </tbody>
      </table>
        </div>
      )}

            {/* Edit Modal for operator */}
            {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <h2>Edit Booking</h2>
                <form>
                  {/* Schedule Dropdown */}
                  <div className="modal-field">
                    <label>Schedule</label>
                    <select 
                      name="scheduleId"
                      value={selectedBooking.scheduleId}
                      onChange={handleInputChangeedit}
                    >
                      {Array.isArray(scheduleList) && scheduleList.map(schedule => (
                        <option key={schedule._id} value={schedule.scheduleId}>
                          {schedule.scheduleId} - {schedule.route?.name || ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Commuter Dropdown */}
                  <div className="modal-field">
                    <label>Commuter</label>
                    <select
                      name="commuterId"
                      value={selectedBooking.commuterId}
                      onChange={handleInputChangeedit}
                    >
                      {commuterList.map(commuter => (
                        <option key={commuter._id} value={commuter._id}>
                          {commuter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Available Seats */}
                  <div className="modal-field">
                    <label>Available Seats</label>
                    <input
                      type="text"
                      value={availableSeats}
                      readOnly
                    />
                  </div>

                  {/* Price per Seat */}
                  <div className="modal-field">
                    <label>Price per Seat</label>
                    <input
                      type="text"
                      value={selectedPrice}
                      readOnly
                    />
                  </div>

                  {/* Book Seats */}
                  <div className="modal-field">
                    <label>Book Seats</label>
                    <input
                      type="number"
                      name="seats"
                      value={selectedBooking.seats}
                      onChange={handleInputChangeedit}
                      max={availableSeats}
                    />
                  </div>

                  {/* Pay Slip Number */}
                  <div className="modal-field">
                    <label>Pay Slip Number</label>
                    <input
                      type="text"
                      name="paySlipNumber" 
                      value={selectedBooking.paySlipNumber}
                      onChange={handleInputChangeedit}
                    />
                  </div>
                </form>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button className="modal-update-btn" onClick={updateBooking}>
                    Update
                  </button>
                  <button className="modal-cancel-btn" onClick={closeModaledit}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
    )}


        {/* Add New Booking Modal for commuter */}

        {isAddModalOpen && isCommuter && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2>Add New Booking</h2>
              <form>
                <div className="modal-field">
                  <label>Bus Schedule</label>
                  <select className="form-control" onChange={(e) => handleScheduleChangec(e.target.value)}>
                    <option value="">Select Schedule</option>
                    {Array.isArray(schedules) && schedules.map((schedule) => (
                      <option key={schedule._id} value={schedule._id}>
                        {schedule.scheduleId} - {new Date(schedule.startTime).toLocaleTimeString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-field">
                  <label>Available Seat</label>
                  <input 
                    type="text" 
                    placeholder="Available seat" 
                    value={selectedAvailability} 
                    disabled 
                  />
                </div>
                <div className="modal-field">
                  <label>Seat</label>
                  <input 
                    type="number"
                    name="seats"
                    placeholder="Enter number of seat"
                    value={formData.seats}
                    onChange={handleInputChangec}
                    min="1"
                    max={selectedAvailability}
                  />
                </div>

                <div className="modal-field-row">
                  <div className="fieldp">
                    <label>Price</label>
                    <div className="price-display">{selectedPrice || "Not Available"}</div>
                  </div>
                  <div className="field">
                    <label>Pay Slip Number</label>
                    <input
                      type="text"
                      name="paySlipNumber"
                      value={formData.paySlipNumber}
                      onChange={handleInputChangec}
                      placeholder="Enter Pay Slip Number"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="modal-add-btn" 
                    onClick={handleSubmit}
                  >
                    Add Booking
                  </button>
                  <button 
                    type="button" 
                    className="modal-cancel-btn" 
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

          {/* Add booking operator */}
          {isAddModalOpen && isOperator && (
            <div className="modal-overlay">
              <div className="modal-container">
                <h2>Add New Booking</h2>
                <form onSubmit={addOperatorSubmit}>  
                <div className="modal-field">
                    <label>Commuter ID</label>
                    <select 
                      name="commuterId"
                      className="form-control" 
                      value={bookingDetails.commuterId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Commuter</option>
                      {Array.isArray(commuters) && commuters.map((commuter) => (
                        <option key={commuter._id} value={commuter._id}>
                          {commuter.email} - {commuter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-field">
                    <label>Bus Schedule</label>
                    <select 
                      className="form-control" 
                      onChange={(e) => handleScheduleChange(e.target.value)}
                    >
                      <option value="">Select Schedule</option>
                      {Array.isArray(schedules) && schedules.map((schedule) => (
                        <option key={schedule._id} value={schedule._id}>
                          {schedule.startTime ? new Date(schedule.startTime).toLocaleTimeString() : "Not Available"} -
                          {schedule.endTime ? new Date(schedule.endTime).toLocaleTimeString() : "Not Available"}
                          ({schedule.route.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-field">
                    <label>Available Seat</label>
                    <input
                      type="text"
                      placeholder="Available seat"
                      value={selectedAvailability}
                      disabled
                    />
                  </div>

                  <div className="modal-field">
                  <label>Seat</label>
                  <input 
                    type="number"
                    name="seats"
                    placeholder="Enter number of seat"
                    value={bookingDetails.seats}
                    onChange={(e) => handleInputChange(e)}
                    min="1"
                    max={selectedAvailability}
                  />
                </div>

                  <div className="modal-row">
                    <div className="modal-field">
                      <label>Price</label>
                      <div className="price-display">{selectedPrice || "Not Available"}</div>
                    </div>
                    <div className="modal-field">
                      <label>Pay Slip Number</label>
                      <input
                        type="text"
                        name="paySlipNumber"
                        value={bookingDetails.paySlipNumber}
                        onChange={handleInputChange}
                        placeholder="Enter Pay Slip Number"
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                  <button 
                      type="submit"  
                      className="modal-add-btn" 
                    >
                      Add Booking
                    </button>
                    <button
                      type="button"
                      className="modal-cancel-btn"
                      onClick={closeAddModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

   {/* Delete Confirmation Dialog */}
   {deleteDialogc && (
        <div className="dialog-overlay">
          <div className="dialog-container">
            <p>Are you sure you want to delete this booking?</p>
            <div className="dialog-actions">
              <button className="dialog-confirm-btn" onClick={handleDeleteConfirm}>
                Yes
              </button>
              <button className="dialog-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-container">
            <p>Are you sure you want to delete this booking?</p>
            <div className="dialog-actions">
              <button className="dialog-confirm-btn" onClick={handleDeleteConfirmo}>
                Yes
              </button>
              <button className="dialog-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {showToast && <div className="toast-message">{toastMessage}</div>}
    </div>
    </div>
    
  );
};

export default BookingList;