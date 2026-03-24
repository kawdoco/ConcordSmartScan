import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import "./GarmentManagement.css";

const garments = [
  { id: "GR-001", branch: "Katunayake", location: "6.9271, 79.8612", phone: "+94 11 445 1122", address: "Phase I, Katunayake EPZ, Katunayake" },
  { id: "GR-002", branch: "Kandy", location: "7.2906, 80.6337", phone: "+94 81 223 4455", address: "Werapitiya Road, Kandy Industrial Park" },
  { id: "GR-003", branch: "Galle", location: "6.0367, 80.2170", phone: "+94 91 334 2211", address: "Koggala EPZ, Habaraduwa" },
  { id: "GR-004", branch: "Biyagama", location: "7.1824, 79.8821", phone: "+94 11 556 7788", address: "Negombo Road, Seeduwa" },
  { id: "GR-005", branch: "Horana", location: "6.7167, 80.0667", phone: "+94 34 226 1100", address: "Horana Export Processing Zone" },
  { id: "GR-006", branch: "Mirigama", location: "7.2167, 80.1167", phone: "+94 33 227 5566", address: "Mirigama Industrial Estate" },
  { id: "GR-007", branch: "Seethawaka", location: "6.9833, 80.1167", phone: "+94 36 222 3344", address: "Seethawaka Industrial Zone" },
  { id: "GR-008", branch: "Nittambuwa", location: "7.1500, 80.0833", phone: "+94 33 229 8800", address: "Nittambuwa Road, Gampaha" },
];

const PAGE_SIZE = 4;

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

function GarmentManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(garments.length / PAGE_SIZE);
  const paginated = garments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="garment-page garment-page-content">
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
                  <td className="garment-id">{row.id}</td>
                  <td className="garment-branch">{row.branch}</td>
                  <td className="garment-lat-long">{row.location}</td>
                  <td>{row.phone}</td>
                  <td>{row.address}</td>
                  <td className="garment-action-icons">
                    <button type="button" title="View" aria-label={`View ${row.branch}`}>
                      <EyeIcon />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      aria-label={`Edit ${row.branch}`}
                      onClick={() => navigate("/garments/edit", { state: { garment: row } })}
                    >
                      <EditIcon />
                    </button>
                    <button type="button" title="Delete" aria-label={`Delete ${row.branch}`} className="delete">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="garment-table-footer">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
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
      <AppFooter />
    </section>
  );
}

export default GarmentManagement;