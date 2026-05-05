import React from 'react';
import Navbar from './Navbar';
// import Footer from './Footer'; // ملي تنشئ ملف Footer حيد ليه التعليق

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout 