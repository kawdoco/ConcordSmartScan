import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import { getAllGarments, deleteLocation } from "../services/locationService";
import "./GarmentManagement.css";

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const PAGE_SIZE = 4;

function GarmentManagement() {
  const navigate = useNavigate();
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = () => {
    setLoading(true);
    setError(null);
    getAllGarments()
      .then(res => {
        // API returns list directly
        const garmentsArray = Array.isArray(res) ? res : res.data || [];
        const formattedGarments = garmentsArray.map(garment => ({
          id: garment.locationId,
          branch: garment.name,
          location: `${garment.latitude}, ${garment.longitude}`,
          phone: garment.contactInfo,
          address: garment.address || 'N/A',
          originalData: garment,
        }));
        setGarments(formattedGarments);
      })
      .catch(err => {
        console.error('Failed to fetch garments:', err);
        setError('Failed to load garments. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (garmentId, garmentName) => {
    setDeleteConfirm({ id: garmentId, name: garmentName });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    deleteLocation(deleteConfirm.id)
      .then(() => {
        setGarments(prev => prev.filter(g => g.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      })
      .catch(err => {
        console.error('Failed to delete garment:', err);
        setError('Failed to delete garment. Please try again.');
      });
  };

  const totalPages = Math.ceil(garments.length / PAGE_SIZE);
  const paginated = garments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="garment-page">
      <div className="garment-table-card">
        <div className="garment-card-header">
          <div>
            <h2 className="garment-card-title">Registered Garments</h2>
            <p className="garment-card-description">Manage all garment manufacturing and storage units.</p>
          </div>
          <button className="garment-add-btn" type="button" onClick={() => navigate("/garments/add")}>
            <span className="garment-add-icon" aria-hidden="true">+</span>
            Add New Garment
          </button>
        </div>

        {error && (
          <div className="garment-error-notice">
            {error}
          </div>
        )}

        {loading ? (
          <div className="garment-loading">Loading garments...</div>
        ) : garments.length === 0 ? (
          <div className="garment-empty">No garments found.</div>
        ) : (
          <div className="garment-table-wrap">
            <table className="garment-table">
              <thead>
                <tr>
                  <th>GARMENT ID</th>
                  <th>BRANCH NAME</th>
                  <th>LOCATION (LAT, LONG)</th>
                  <th>PHONE NUMBER</th>
                  <th>ADDRESS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id}>
                    <td className="garment-id">GAR-{String(row.id).padStart(3, '0')}</td>
                    <td className="garment-branch">{row.branch}</td>
                    <td className="garment-lat-long">{row.location}</td>
                    <td>{row.phone}</td>
                    <td>{row.address}</td>
                    <td className="garment-action-icons">
                      <button
                        type="button"
                        title="View"
                        aria-label={`View ${row.branch}`}
                        onClick={() => navigate(`/garments/view/${row.id}`, { state: { garment: row.originalData } })}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        aria-label={`Edit ${row.branch}`}
                        onClick={() => navigate("/garments/edit", { state: { garment: row.originalData } })}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        aria-label={`Delete ${row.branch}`}
                        className="delete"
                        onClick={() => handleDelete(row.id, row.branch)}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="garment-table-footer">
          <span>
            Showing {garments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(currentPage * PAGE_SIZE, garments.length)} of {garments.length} garments
          </span>
          <div className="garment-pagination" aria-label="Garment pages">
            <button
              className="garment-page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              type="button"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                className={`garment-page-btn ${pg === currentPage ? "garment-page-active" : ""}`.trim()}
                onClick={() => setCurrentPage(pg)}
                type="button"
              >
                {pg}
              </button>
            ))}
            <button
              className="garment-page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <div className="garment-delete-modal">
          <div className="garment-delete-modal-content">
            <h3>Delete Garment</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="garment-delete-modal-actions">
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
}

export default GarmentManagement;