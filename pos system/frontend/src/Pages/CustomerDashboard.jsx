import React from 'react';
import CustomerSidebar from '../Components/CustomerSidebar';
import { Outlet } from 'react-router-dom';

function CustomerDashboard() {
  return (
    <div className='flex h-screen overflow-hidden'>
      <CustomerSidebar />

      <div className='flex-1 ml-16 md:ml-64 bg-gray-100 overflow-y-auto'>
        <div className='p-6'>
          <Outlet />
        </div>    
      </div>
    </div>
  );
}

export default CustomerDashboard;
