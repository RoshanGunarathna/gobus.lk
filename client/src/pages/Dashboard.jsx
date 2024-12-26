// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Widget from '../components/Widget';

import '../styles/dashboard.css';
import Chart from '../components/Chart';
import { useState, useEffect } from 'react';


import { getDashboardData } from '../api/dashboardApi';




function Dashboard() {

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [dashboardData, setDashboardData] = useState(null);


    useEffect(() => {
      fetchDashBoardData();
    }, []);
  
    const fetchDashBoardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
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
       
  
            <Widget type="booking" valueData={dashboardData?.totalBookings} />
          <Widget type="revenue" valueData={dashboardData?.totalRevenue} />
          <Widget type="commuter" valueData={dashboardData?.totalCommuters} />
          <Widget type="route" valueData={dashboardData?.totalRoutes} />
    
        </div>
        <div className='maintitles'>
                Revenue Chart
                </div>
        <div className='charts'>
       
          <Chart valueData={dashboardData?.revenueWithDateList}>

          </Chart>
        </div>
        
      </div>
    </div>
     
  );
}


export default Dashboard;