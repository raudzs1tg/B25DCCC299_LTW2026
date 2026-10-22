import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notfound-box">
      <div className="notfound-code">404</div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>
        404 - Không tìm thấy trang
      </h2>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
