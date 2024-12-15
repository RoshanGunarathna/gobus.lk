import React, { useState } from "react";
import "../styles/bookingmanagement.css";

const BookingList = ({ userType }) => {
  const [bookings, setBookings] = useState([
    {
      id: "B0001",
      start: "4.00",
      end: "6.00",
      routeId: "EX1 - 22",
      routeName: "Mathara - Kadawatha",
      busNumber: "NC-8552",
      scheduleId: "S0003",
      seat: 54,
    },
    {
      id: "B0002",
      start: "8.00",
      end: "10.00",
      routeId: "EX1 - 22",
      routeName: "Mathara - Kadawatha",
      busNumber: "NC-8552",
      scheduleId: "S0003",
      seat: 54,
    },
  ]);

  // Predefined options for dropdowns
  const busRoutes = [
    { id: "EX1 - 22", name: "Mathara - Kadawatha" },
    { id: "EX2 - 33", name: "Colombo - Kandy" },
    { id: "EX3 - 44", name: "Galle - Colombo" },
  ];

  const busSchedules = [
    { id: "S0003", time: "4.00 AM - 6.00 AM" },
    { id: "S0004", time: "8.00 AM - 10.00 AM" },
    { id: "S0005", time: "12.00 PM - 2.00 PM" },
  ];

  const availableSeats = [
    { number: 12, status: "Available" },
    { number: 24, status: "Available" },
    { number: 36, status: "Available" },
    { number: 48, status: "Available" },
    { number: 54, status: "Available" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  
  // New booking state
  const [newBooking, setNewBooking] = useState({
    id: `B${String(bookings.length + 1).padStart(4, '0')}`,
    start: "",
    end: "",
    routeId: "",
    routeName: "",
    busNumber: "",
    scheduleId: "",
    seat: null,
    paySlipNumber: "",
  });

  const openModal = (booking) => {
    setSelectedBooking({ ...booking });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const updateBooking = () => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === selectedBooking.id ? selectedBooking : booking
      )
    );
    setIsModalOpen(false);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const confirmDelete = (id) => {
    setDeleteBookingId(id);
    setDeleteDialog(true);
  };

  const handleDelete = () => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== deleteBookingId)
    );
    setDeleteDialog(false);
    setShowToast(true);

    // Show delete toast message
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const cancelDelete = () => {
    setDeleteDialog(false);
    setDeleteBookingId(null);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    // Reset the new booking state
    setNewBooking({
      id: `B${String(bookings.length + 1).padStart(4, '0')}`,
      start: "",
      end: "",
      routeId: "",
      routeName: "",
      busNumber: "",
      scheduleId: "",
      seat: null,
      paySlipNumber: "",
    });
  };

  const handleAddBookingChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for route selection to set both ID and name
    if (name === "routeId") {
      const selectedRoute = busRoutes.find(route => route.id === value);
      setNewBooking(prev => ({
        ...prev,
        routeId: value,
        routeName: selectedRoute ? selectedRoute.name : "",
      }));
    } else if (name === "scheduleId") {
      const selectedSchedule = busSchedules.find(schedule => schedule.id === value);
      setNewBooking(prev => ({
        ...prev,
        scheduleId: value,
        start: selectedSchedule ? selectedSchedule.time.split(" - ")[0] : "",
        end: selectedSchedule ? selectedSchedule.time.split(" - ")[1] : "",
      }));
    } else {
      setNewBooking(prev => ({ ...prev, [name]: value }));
    }
  };

  const addNewBooking = () => {
    // Validate that all required fields are filled
    if (!newBooking.routeId || !newBooking.scheduleId || !newBooking.seat || !newBooking.paySlipNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    // Add the new booking to the bookings array
    setBookings(prev => [...prev, newBooking]);

    // Show success toast
    setShowToast(true);
    setIsAddModalOpen(false);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    // Reset the new booking state
    setNewBooking({
      id: `B${String(bookings.length + 2).padStart(4, '0')}`,
      start: "",
      end: "",
      routeId: "",
      routeName: "",
      busNumber: "",
      scheduleId: "",
      seat: null,
      paySlipNumber: "",
    });
  };

  return (
    <div className="bus-management-container">
      <h1>Booking List</h1>
      <div className="table-container">
        {userType === "commuter" && (
          <button className="add-booking-btn" onClick={openAddModal}>
            Add New Booking
          </button>
        )}
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
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.start}</td>
                <td>{booking.end}</td>
                <td>{booking.routeId}</td>
                <td>{booking.routeName}</td>
                <td>{booking.busNumber}</td>
                <td>{booking.scheduleId}</td>
                <td>{booking.seat}</td>
                <td>
                  <button className="edit-btn" onClick={() => openModal(booking)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Existing Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Edit Booking</h2>
            <form>
              <div className="modal-field">
                <label>Booking ID</label>
                <input type="text" value={selectedBooking.id} disabled />
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Start Time</label>
                  <input
                    type="text"
                    name="start"
                    value={selectedBooking.start}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-field">
                  <label>End Time</label>
                  <input
                    type="text"
                    name="end"
                    value={selectedBooking.end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Route ID</label>
                  <input
                    type="text"
                    name="routeId"
                    value={selectedBooking.routeId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-field">
                  <label>Route Name</label>
                  <input
                    type="text"
                    name="routeName"
                    value={selectedBooking.routeName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-field">
                <label>Bus Number</label>
                <input
                  type="text"
                  name="busNumber"
                  value={selectedBooking.busNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-field">
                <label>Schedule ID</label>
                <input
                  type="text"
                  name="scheduleId"
                  value={selectedBooking.scheduleId}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-field">
                <label>Seat</label>
                <input
                  type="number"
                  name="seat"
                  value={selectedBooking.seat}
                  onChange={handleInputChange}
                />
              </div>
            </form>
            <div className="modal-actions">
              <button className="modal-update-btn" onClick={updateBooking}>
                Update
              </button>
              <button className="modal-cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Booking Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Add New Booking</h2>
            <form>
              <div className="modal-field">
                <label>Booking ID</label>
                <input 
                  type="text" 
                  value={newBooking.id} 
                  disabled 
                />
              </div>
              
              <div className="modal-field">
                <label>Bus Route</label>
                <select
                  name="routeId"
                  value={newBooking.routeId}
                  onChange={handleAddBookingChange}
                >
                  <option value="">Select Route</option>
                  {busRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Bus Schedule</label>
                <select
                  name="scheduleId"
                  value={newBooking.scheduleId}
                  onChange={handleAddBookingChange}
                >
                  <option value="">Select Schedule</option>
                  {busSchedules.map(schedule => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Bus Seat</label>
                <select
                  name="seat"
                  value={newBooking.seat || ""}
                  onChange={handleAddBookingChange}
                >
                  <option value="">Select Seat</option>
                  {availableSeats.map(seat => (
                    <option key={seat.number} value={seat.number}>
                      {seat.number} - {seat.status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label>Price</label>
                <input 
                  type="text" 
                />
              </div>
              <div className="modal-field">
                <label>Pay Slip Number</label>
                <input
                  type="text"
                  name="paySlipNumber"
                  value={newBooking.paySlipNumber}
                  onChange={handleAddBookingChange}
                  placeholder="Enter Pay Slip Number"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="modal-add-btn" 
                  onClick={addNewBooking}
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
      {deleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-container">
            <p>Are you sure you want to delete this booking?</p>
            <div className="dialog-actions">
              <button className="dialog-confirm-btn" onClick={handleDelete}>
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
      {showToast && <div className="toast-message">Action successful!</div>}
    </div>
  );
};

export default BookingList;