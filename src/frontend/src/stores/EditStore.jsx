import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PagePath from "../components/PagePath";
import MapSelector from "../components/MapSelector";
import { useToast } from "../components/Toast";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { updateStore } from "../services/locationService";
import "./EditStore.css";

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

function IconInfo() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	);
}

const FALLBACK_STORE = {
	storeName: "Concord - Biyagama Main Branch",
	storeId: "ST025",
	phoneNumber: "+94 11 234 5678",
	address: "123 Industrial Zone, Biyagama, Western Province, Sri Lanka",
	latitude: "6.9271",
	longitude: "79.8612"
};

function mapStoreToForm(store) {
	if (!store) return { ...FALLBACK_STORE };

	// Handle both old and new data formats
	const isNewFormat = store.locationId !== undefined;

	if (isNewFormat) {
		// New format from API (Location model)
		return {
			storeName: store.name || FALLBACK_STORE.storeName,
			storeId: store.locationId || FALLBACK_STORE.storeId,
			phoneNumber: store.contactInfo || FALLBACK_STORE.phoneNumber,
			address: store.address || FALLBACK_STORE.address,
			latitude: store.latitude ? String(store.latitude) : FALLBACK_STORE.latitude,
			longitude: store.longitude ? String(store.longitude) : FALLBACK_STORE.longitude
		};
	} else {
		// Old format (for backward compatibility)
		const [latitude = "", longitude = ""] = (store.latLong || "")
			.split(",")
			.map((value) => value.trim());

		return {
			storeName: store.name || FALLBACK_STORE.storeName,
			storeId: store.id || FALLBACK_STORE.storeId,
			phoneNumber: store.phone || FALLBACK_STORE.phoneNumber,
			address: store.address || FALLBACK_STORE.address,
			latitude: latitude || FALLBACK_STORE.latitude,
			longitude: longitude || FALLBACK_STORE.longitude
		};
	}
}

export default function EditStore() {
	const location = useLocation();
	const navigate = useNavigate();
	const { showToast } = useToast();

	const initialForm = useMemo(() => mapStoreToForm(location.state?.store), [location.state?.store]);

	const [form, setForm] = useState(initialForm);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const storeId = location.state?.store?.locationId;

	useEffect(() => {
		setForm(initialForm);
		setErrors({});
	}, [initialForm]);

	const validate = () => {
		const nextErrors = {};

		if (!form.storeName.trim()) nextErrors.storeName = "Store name is required.";

		const phoneDigits = form.phoneNumber.replace(/\D/g, "");
		if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
		else if (phoneDigits.length < 10 || phoneDigits.length > 15) nextErrors.phoneNumber = "Phone number must contain 10 to 15 digits.";

		if (!form.address.trim()) nextErrors.address = "Address is required.";

		if (!form.latitude.trim()) nextErrors.latitude = "Latitude is required.";
		else if (isNaN(form.latitude) || Number(form.latitude) < -90 || Number(form.latitude) > 90) {
			nextErrors.latitude = "Latitude must be between -90 and 90.";
		}

		if (!form.longitude.trim()) nextErrors.longitude = "Longitude is required.";
		else if (isNaN(form.longitude) || Number(form.longitude) < -180 || Number(form.longitude) > 180) {
			nextErrors.longitude = "Longitude must be between -180 and 180.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
		setErrors((previous) => ({ ...previous, [name]: "" }));
	};

	const handleLocationSelect = (latitude, longitude) => {
		setForm((previous) => ({
			...previous,
			latitude: latitude.toFixed(6),
			longitude: longitude.toFixed(6)
		}));
		setErrors((previous) => ({ ...previous, latitude: "", longitude: "" }));
	};

	const handleUpdate = async () => {
		if (!validate()) return;
		if (!storeId) {
			showToast("Error: Store ID not found", "error");
			return;
		}
		setIsConfirmOpen(false);

		setIsSubmitting(true);

		try {
			const payload = {
				name: form.storeName.trim(),
				contactInfo: form.phoneNumber.trim(),
				address: form.address.trim(),
				latitude: form.latitude ? Number(form.latitude) : null,
				longitude: form.longitude ? Number(form.longitude) : null,
			};

			await updateStore(storeId, payload);
			showToast("Store updated successfully!", "success");

			// Redirect after a short delay to show the success message
			setTimeout(() => {
				navigate('/stores');
			}, 1500);
		} catch (err) {
			const errorMsg = err.response?.data?.message || err.message || "Failed to update store. Please try again.";
			showToast(errorMsg, "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenConfirm = () => {
		if (!validate()) return;
		if (!storeId) {
			showToast("Error: Store ID not found", "error");
			return;
		}
		setIsConfirmOpen(true);
	};

	const handleCancel = () => {
		setForm(initialForm);
		setErrors({});
		navigate('/stores');
	};

	return (
		<section className="edit-store-page">
			<PagePath items={[{ label: "Stores", to: "/stores" }, { label: "Edit Store" }]} />

			<div className="edit-store-card">
				<div className="edit-store-card-header">
					<span className="edit-store-card-icon"><IconStores /></span>
					<div>
						<h2>Store Details</h2>
						<p>Update the store information below.</p>
					</div>
				</div>

				<div className="edit-store-card-body">
					<div className="edit-store-field">
						<label htmlFor="storeName">Store Name</label>
						<input
							id="storeName"
							name="storeName"
							value={form.storeName}
							onChange={handleChange}
							className={errors.storeName ? "error" : ""}
						/>
						{errors.storeName && <span className="edit-store-error">{errors.storeName}</span>}
					</div>

					<div className="edit-store-grid-two">
						<div className="edit-store-field">
							<label htmlFor="storeId">
								Store ID <span className="edit-store-inline-icon"><IconInfo /></span>
							</label>
							<input id="storeId" value={`STO-${String(form.storeId).padStart(3, '0')}`} disabled className="disabled" />
							<span className="edit-store-hint">Fixed system identifier</span>
						</div>

						<div className="edit-store-field">
							<label htmlFor="phoneNumber">Phone Number</label>
							<input
								id="phoneNumber"
								name="phoneNumber"
								value={form.phoneNumber}
								onChange={handleChange}
								className={errors.phoneNumber ? "error" : ""}
							/>
							{errors.phoneNumber && <span className="edit-store-error">{errors.phoneNumber}</span>}
						</div>
					</div>

					<div className="edit-store-field">
						<label htmlFor="address">Address</label>
						<textarea
							id="address"
							name="address"
							rows={3}
							value={form.address}
							onChange={handleChange}
							className={errors.address ? "error" : ""}
						/>
						{errors.address && <span className="edit-store-error">{errors.address}</span>}
					</div>

					<div className="edit-store-location-heading">
						<span><IconMapPin /></span>
						<div>
							<h3>Location Coordinates</h3>
							<p>Required - GPS coordinates for map pinning.</p>
						</div>
					</div>

					<div className="edit-store-grid-two">
						<div className="edit-store-field">
							<label htmlFor="latitude">Latitude</label>
							<input
								id="latitude"
								name="latitude"
								value={form.latitude}
								onChange={handleChange}
								className={errors.latitude ? "error" : ""}
							/>
							{errors.latitude && <span className="edit-store-error">{errors.latitude}</span>}
						</div>

						<div className="edit-store-field">
							<label htmlFor="longitude">Longitude</label>
							<input
								id="longitude"
								name="longitude"
								value={form.longitude}
								onChange={handleChange}
								className={errors.longitude ? "error" : ""}
							/>
							{errors.longitude && <span className="edit-store-error">{errors.longitude}</span>}
						</div>
					</div>

					<div className="edit-store-field">
						<label>Location Map</label>
						<p className="edit-store-help-text">Click on the map to select the store location. The coordinates will be automatically filled above.</p>
						<MapSelector
							latitude={form.latitude ? parseFloat(form.latitude) : null}
							longitude={form.longitude ? parseFloat(form.longitude) : null}
							onLocationSelect={handleLocationSelect}
						/>
					</div>
				</div>

				<div className="edit-store-actions">
				<button type="button" className="btn-secondary" onClick={handleCancel} disabled={isSubmitting}>Cancel</button>
				<button type="button" className="btn-primary" onClick={handleOpenConfirm} disabled={isSubmitting}>
					<IconEdit />
					{isSubmitting ? "Updating..." : "Update Store"}
					</button>
				</div>
			</div>

			<ConfirmActionModal
				isOpen={isConfirmOpen}
				title="Confirm Update"
				message="Are you sure you want to update this store?"
				confirmLabel="Yes, Update"
				cancelLabel="Cancel"
				variant="approve"
				isSubmitting={isSubmitting}
				onConfirm={handleUpdate}
				onCancel={() => setIsConfirmOpen(false)}
			/>

			<AppFooter />
		</section>
	);
}