import React from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />

      <div className='flex-1 ml-16 md:ml-64 bg-gray-100 overflow-y-auto'>
        <div className='p-6'>
          <Outlet />
        </div>    
      </div>
    </div>
  )
}

export default Dashboard
