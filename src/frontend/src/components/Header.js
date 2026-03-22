import React from 'react';
import './Header.css';

const Header = ({ 
  onMenuToggle, 
  searchPlaceholder = "Search by Machine ID, Store ID, or Garment ID",
  userName = "Admin User",
  userEmail = "system.admin@concord.com",
  userRole = "admin",
  showSearch = true,
  showNotifications = true
}) => {
  return (
    <div className="header">
      <button className="hamburger-menu" onClick={onMenuToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {showSearch && (
        <div className="header-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder={searchPlaceholder} />
        </div>
      )}
      
      <div className="header-right">
        {showNotifications && (
          <button className="notification-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-badge"></span>
          </button>
        )}
        
        <div className="user-profile">
          <div className="user-profile-info">
            <div className="user-profile-name">{userName}</div>
            <div className="user-profile-email">{userEmail}</div>
          </div>
          <div className="user-profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
