import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-32">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
