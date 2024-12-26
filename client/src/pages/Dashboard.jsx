// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Widget from '../components/Widget';

import '../styles/dashboard.css';
import Chart from '../components/Chart';
import { useState, useEffect } from 'react';


import { getAdminDashboardData, getOperatorDashboardData } from '../api/dashboardApi';

import { useSelector } from "react-redux";






function Dashboard() {

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [dashboardData, setDashboardData] = useState(null);

    const isAdmin = useSelector((state) => {
      return state.user.user;
    }).role === "admin";


    useEffect(() => {
      fetchDashBoardData(isAdmin);
    }, []);
  
    const fetchDashBoardData = async (isAdmin) => {
      try {
        setLoading(true);
     var data;
      if(isAdmin){
         data = await getAdminDashboardData();
      } else{
        data = await getOperatorDashboardData();

        console.log("Operator data", data);
      }
       
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        showToast(`${err.message}`);
      }
    };

    const showToast = (message, type) => {
      setToast({ show: true, message, type });
      setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
    };

  
  

  return (
    <div className="dashboard">
      <Sidebar />
      <div className='dashBoardContainer'>

        <div className="widgets">
       
        {/* {totalBookings: 0, totalCommuters: 2, totalRoutes: 3, availableSeats: 128, totalBookedSeats: 0} */}
  
            <Widget type="booking" valueData={dashboardData?.totalBookings} />
            {isAdmin ? <Widget type="revenue" valueData={dashboardData?.totalRevenue} /> : <Widget type="availableSeats" valueData={dashboardData?.availableSeats}/>}
          <Widget type="commuter" valueData={dashboardData?.totalCommuters} />
          <Widget type="route" valueData={dashboardData?.totalRoutes} />
    
        </div>
        <div className='maintitles'>
        {isAdmin ?  "Revenue Chart" : "Bookings Chart"}
                </div>
        <div className='charts'>
       
       

        {isAdmin ? <Chart type="revenue" valueData={dashboardData?.revenueWithDateList}/> :  <Chart type="booking" valueData={dashboardData?.bookingWithDateList}/> }

        
        </div>
        
      </div>
    </div>
     
  );
}


export default Dashboard;
