import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import { getStoreById } from "../services/locationService";
import "./ViewStore.css";

function IconStores() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

export default function ViewStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Store ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getStoreById(id)
      .then(data => {
        setStore(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch store:", err);
        setError("Failed to load store details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="view-store-page">
        <div style={{ padding: "20px", textAlign: "center" }}>Loading store details...</div>
        <AppFooter />
      </section>
    );
  }

  if (error || !store) {
    return (
      <section className="view-store-page">
        <div style={{ padding: "20px", textAlign: "center", color: "#dc2626" }}>
          {error || "Store not found"}
        </div>
        <AppFooter />
      </section>
    );
  }

  return (
    <section className="view-store-page">
      <PagePath items={[{ label: "Stores", to: "/stores" }, { label: `Store Details: ${id}` }]} />

      <div className="view-store-card">
        <div className="view-store-card-header">
          <div className="view-store-header-content">
            <span className="view-store-card-icon"><IconStores /></span>
            <h2 className="view-store-card-title">Store Information</h2>
          </div>
          <button
            type="button"
            className="view-store-edit-btn"
            onClick={() => navigate(`/stores/edit`, { state: { store } })}
          >
            <IconEdit />
            Edit Store
          </button>
        </div>

        <div className="view-store-card-body">
          <div className="view-store-details-grid">
            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Store ID</span>
              <span className="view-store-detail-value">STO-{String(store.locationId).padStart(3, '0')}</span>
            </div>

            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Store Name</span>
              <span className="view-store-detail-value">{store.name}</span>
            </div>

            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Phone Number</span>
              <span className="view-store-detail-value">{store.contactInfo}</span>
            </div>

            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Address</span>
              <span className="view-store-detail-value">{store.address || "N/A"}</span>
            </div>

            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Latitude</span>
              <span className="view-store-detail-value">{store.latitude || "N/A"}</span>
            </div>

            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Longitude</span>
              <span className="view-store-detail-value">{store.longitude || "N/A"}</span>
            </div>

            <div className="view-store-detail-item">
              <span className="view-store-detail-label">Type</span>
              <span className="view-store-detail-value">
                <span className="view-store-type-badge">{store.type}</span>
              </span>
            </div>
          </div>

          {store.latitude && store.longitude && (
            <div className="view-store-map-section">
              <h3>Location Coordinates</h3>
              <p className="view-store-coordinates">
                <IconMapPin style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Lat: {store.latitude}, Long: {store.longitude}
              </p>
            </div>
          )}
        </div>

        <div className="view-store-actions">
          <button
            type="button"
            className="view-store-back-btn"
            onClick={() => navigate('/stores')}
          >
            Back to Stores
          </button>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}
