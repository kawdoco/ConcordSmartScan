import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import AppFooter from '../components/AppFooter';
import TableEmptyState from '../components/TableEmptyState';
import { getAllStores, deleteLocation } from '../services/locationService';
import './StoreManagement.css';

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

const StoreManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = String(user?.role || '').toUpperCase();
  const canManageStores = role === 'ADMIN';
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
    <section className="store-page">
      <div className="store-table-card">
        <div className="store-card-header">
          <div>
            <h2 className="store-card-title">Registered Stores</h2>
            <p className="store-card-description">Manage all store branches and location records.</p>
          </div>
          {canManageStores && (
            <button className="store-add-btn" type="button" onClick={() => navigate('/stores/add')}>
              <span className="store-add-icon" aria-hidden="true">+</span>
              Add New Store
            </button>
          )}
        </div>

        {error && (
          <div className="store-error-notice">
            {error}
          </div>
        )}

        <div className="store-data-area">
          {loading ? (
            <div className="store-loading">Loading stores...</div>
          ) : stores.length === 0 ? (
            <TableEmptyState message="No store found" minHeight={392} />
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
                      <td className="store-id">STO-{String(store.id).padStart(3, '0')}</td>
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
                        {canManageStores && (
                          <button
                            type="button"
                            aria-label={`Edit ${store.name}`}
                            onClick={() => navigate('/stores/edit', { state: { store: store.originalData } })}
                          >
                            <EditIcon />
                          </button>
                        )}
                        {canManageStores && (
                          <button
                            type="button"
                            aria-label={`Delete ${store.name}`}
                            className="delete"
                            onClick={() => handleDelete(store.id, store.name)}
                          >
                            <DeleteIcon />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="store-table-footer">
          <span>Showing {stores.length} stores</span>
          <div className="store-pagination" aria-label="Store pages">
            <button type="button" className="store-page-btn store-page-active">1</button>
          </div>
        </div>
      </div>

      {canManageStores && deleteConfirm && (
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