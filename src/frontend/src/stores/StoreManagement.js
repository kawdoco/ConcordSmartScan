import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import './StoreManagement.css';

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1.5 12s3.75-6 10.5-6 10.5 6 10.5 6-3.75 6-10.5 6S1.5 12 1.5 12z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10a2 2 0 0 0-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const StoreManagement = () => {
  const navigate = useNavigate();

  const stores = [
    { id: 'ST-101', name: 'Colombo 03', latLong: '6.9271, 79.8612', phone: '+94 11 234 5678', address: 'No. 45, Galle Road, Colombo 03' },
    { id: 'ST-105', name: 'Peradeniya', latLong: '7.2906, 80.6337', phone: '+94 81 987 6543', address: 'Peradeniya Road, Kandy' },
    { id: 'ST-108', name: 'Galle', latLong: '6.0367, 80.2170', phone: '+94 91 555 1234', address: 'Industrial Zone, Galle' },
  ];

  const totalStores = 42;

  return (
    <section className="store-page store-page-content">
      <div className="store-table-card">
        <div className="store-card-header">
          <div>
            <h2 className="store-card-title">Registered Stores</h2>
          </div>
          <button className="store-add-btn" type="button" onClick={() => navigate('/stores/add')}>
            <span className="store-add-icon" aria-hidden="true">+</span>
            Add New Store
          </button>
        </div>

        <div className="store-table-wrap">
          <table className="store-table">
            <thead>
              <tr>
                <th>STORE ID</th>
                <th>BRANCH NAME</th>
                <th>LOCATION (LAT, LONG)</th>
                <th>PHONE NUMBER</th>
                <th>ADDRESS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="store-id">{store.id}</td>
                  <td className="store-name">{store.name}</td>
                  <td className="store-lat-long">{store.latLong}</td>
                  <td>{store.phone}</td>
                  <td>{store.address}</td>
                  <td className="store-action-icons">
                    <button type="button" aria-label={`View ${store.name}`}>
                      <EyeIcon />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${store.name}`}
                      onClick={() => navigate('/stores/edit', { state: { store } })}
                    >
                      <EditIcon />
                    </button>
                    <button type="button" aria-label={`Delete ${store.name}`}>
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="store-table-footer">
          <span>Showing 1 to {stores.length} of {totalStores} stores</span>
          <div className="store-pagination" aria-label="Store pages">
            <button type="button" className="store-page-btn store-page-active">1</button>
            <button type="button" className="store-page-btn">2</button>
            <button type="button" className="store-page-btn">3</button>
            <button type="button" className="store-page-btn" aria-label="Next page">&gt;</button>
          </div>
        </div>
      </div>

      <AppFooter />
    </section>
  );
};

export default StoreManagement;