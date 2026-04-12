import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import { useToast } from "../components/Toast";
import { getGarmentById } from "../services/locationService";
import "./ViewGarment.css";

function IconGarment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4l2 4h8l2-4" />
      <path d="M9 8v12h6V8" />
      <path d="M9 12h6" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default function ViewGarment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [garment, setGarment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Garment ID not found");
      showToast("Garment ID not found", "error");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getGarmentById(id)
      .then(data => {
        setGarment(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch garment:", err);
        setError("Failed to load garment details. Please try again.");
        showToast("Failed to load garment details. Please try again.", "error");
        setLoading(false);
      });
  }, [id, showToast]);

  if (loading) {
    return (
      <section className="view-garment-page">
        <div style={{ padding: "20px", textAlign: "center" }}>Loading garment details...</div>
        <AppFooter />
      </section>
    );
  }

  if (error || !garment) {
    return (
      <section className="view-garment-page">
        <div style={{ padding: "20px", textAlign: "center", color: "#dc2626" }}>
          {error || "Garment not found"}
        </div>
        <AppFooter />
      </section>
    );
  }

  return (
    <section className="view-garment-page">
      <PagePath items={[{ label: "Garments", to: "/garments" }, { label: "Garment Details" }]} />

      <div className="view-garment-card">
        <div className="view-garment-card-header">
          <div className="view-garment-header-content">
            <span className="view-garment-card-icon"><IconGarment /></span>
            <h2 className="view-garment-card-title">Garment Information</h2>
          </div>
          <button
            type="button"
            className="view-garment-edit-btn"
            onClick={() => navigate(`/garments/edit`, { state: { garment } })}
          >
            <IconEdit />
            Edit Garment
          </button>
        </div>

        <div className="view-garment-card-body">
          <div className="view-garment-details-grid">
            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Garment ID</span>
              <span className="view-garment-detail-value">GAR-{String(garment.locationId).padStart(3, '0')}</span>
            </div>

            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Branch Name</span>
              <span className="view-garment-detail-value">{garment.name}</span>
            </div>

            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Phone Number</span>
              <span className="view-garment-detail-value">{garment.contactInfo}</span>
            </div>

            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Address</span>
              <span className="view-garment-detail-value">{garment.address || "N/A"}</span>
            </div>

            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Latitude</span>
              <span className="view-garment-detail-value">{garment.latitude || "N/A"}</span>
            </div>

            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Longitude</span>
              <span className="view-garment-detail-value">{garment.longitude || "N/A"}</span>
            </div>

            <div className="view-garment-detail-item">
              <span className="view-garment-detail-label">Type</span>
              <span className="view-garment-detail-value">
                <span className="view-garment-type-badge">{garment.type}</span>
              </span>
            </div>
          </div>

          {garment.latitude && garment.longitude && (
            <div className="view-garment-map-section">
              <h3>Location Coordinates</h3>
              <p className="view-garment-coordinates">
                <IconMapPin style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Lat: {garment.latitude}, Long: {garment.longitude}
              </p>
            </div>
          )}
        </div>

        <div className="view-garment-actions">
          <button
            type="button"
            className="view-garment-back-btn"
            onClick={() => navigate('/garments')}
          >
            Back to Garments
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
