import React, { useState } from 'react';
import DashNavbar from '../components/dashboard/DashNavbar';
import './Dashboard.css';
import DashboardHero from '../components/dashboard/DashboardHero';
import Products from '../components/dashboard/Products';

const Dashboard = () => {

  return (
    <div className="dash-wrapper">
      <DashNavbar />
      <DashboardHero />
      <Products/>
    </div>
  );
};

export default Dashboard;