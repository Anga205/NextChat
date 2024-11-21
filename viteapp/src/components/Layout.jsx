// src/components/Layout.jsx
import React from 'react';
import VerticalNavbar from './VerticalNavbar';  // Import the VerticalNavbar
import { Outlet } from 'react-router-dom';  // Import Outlet for dynamic routing

const Layout = () => {
  return (
    <div>
      <VerticalNavbar /> {/* Always show the navbar */}
      <div>
        <Outlet /> {/* Render the specific page content here */}
      </div>
    </div>
  );
};

export default Layout;
