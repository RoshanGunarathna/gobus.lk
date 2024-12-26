import '../styles/chart.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import React from 'react'


const Chart = ({type, valueData}) => {

  console.log(valueData);
  console.log(type);

  let data;

  switch (type) {
      case "revenue":
          data={
            dataKey:"revenue",
             
          }
          break;
          case "booking":
          data={
            dataKey:"bookings",
             
          }
          break;
         
      default:
          break;
  }


  return (
    <div className='chart'>
      
        <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      width={500}
      height={400}
      data={valueData}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey={data.dataKey} stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  </ResponsiveContainer></div>
  )
}

export default Chart


{/* <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer> */}