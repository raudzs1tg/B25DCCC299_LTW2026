import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span>🏆</span>
        <span>Ai Là Triệu Phú</span>
      </div>
      <nav>
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'nav-link-active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? 'red' : undefined,
                fontWeight: isActive ? 'bold' : undefined,
              })}
            >
              Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/questions"
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'nav-link-active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? 'red' : undefined,
                fontWeight: isActive ? 'bold' : undefined,
              })}
            >
              Ngân hàng câu hỏi
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'nav-link-active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? 'red' : undefined,
                fontWeight: isActive ? 'bold' : undefined,
              })}
            >
              Lịch sử
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
