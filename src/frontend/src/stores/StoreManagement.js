import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import { getAllStores, deleteLocation } from '../services/locationService';
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
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = () => {
    setLoading(true);
    setError(null);
    getAllStores()
      .then(res => {
        // getAllStores() returns the filtered array directly, not a response object
        const storesArray = Array.isArray(res) ? res : res.data || [];
        const formattedStores = storesArray.map(store => ({
          id: store.locationId,
          name: store.name,
          latLong: `${store.latitude}, ${store.longitude}`,
          phone: store.contactInfo,
          address: store.address || 'N/A',
          originalData: store, // Keep original data for editing
        }));
        setStores(formattedStores);
      })
      .catch(err => {
        console.error('Failed to fetch stores:', err);
        setError('Failed to load stores. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (storeId, storeName) => {
    setDeleteConfirm({ id: storeId, name: storeName });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    deleteLocation(deleteConfirm.id)
      .then(() => {
        setStores(prev => prev.filter(s => s.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      })
      .catch(err => {
        console.error('Failed to delete store:', err);
        setError('Failed to delete store. Please try again.');
      });
  };

  const totalStores = stores.length;

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

        {error && (
          <div className="store-error-notice">
            {error}
          </div>
        )}

        {loading ? (
          <div className="store-loading">Loading stores...</div>
        ) : stores.length === 0 ? (
          <div className="store-empty">No stores found.</div>
        ) : (
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
                      <button
                        type="button"
                        aria-label={`View ${store.name}`}
                        onClick={() => navigate(`/stores/view/${store.id}`, { state: { store: store.originalData } })}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${store.name}`}
                        onClick={() => navigate('/stores/edit', { state: { store: store.originalData } })}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${store.name}`}
                        onClick={() => handleDelete(store.id, store.name)}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="store-table-footer">
          <span>Showing {stores.length} stores</span>
          <div className="store-pagination" aria-label="Store pages">
            <button type="button" className="store-page-btn store-page-active">1</button>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <div className="store-delete-modal">
          <div className="store-delete-modal-content">
            <h3>Delete Store</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="store-delete-modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AppFooter />
    </section>
  );
};

export default StoreManagement;