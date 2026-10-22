import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        {loading ? (
          <div className="state-message-box loading-text">
            Đang tải câu hỏi...
          </div>
        ) : error ? (
          <div className="state-message-box error-text">
            Không tải được câu hỏi
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Layout;
