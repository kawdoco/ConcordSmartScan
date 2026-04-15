import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import PagePath from '../components/PagePath';
import GenericLookupInput from '../components/GenericLookupInput';
import ConfirmActionModal from '../components/ConfirmActionModal';
import apiClient from '../services/api';
import './AddUser.css';

const formatGarmentDisplayId = (garmentId) => {
  const parsed = Number(garmentId);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return '';
  }
  return `GAR-${String(parsed).padStart(3, '0')}`;
};

const parseGarmentId = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return null;
  }

  const match = normalized.match(/(\d+)/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isInteger(parsed) ? parsed : null;
};

const AddUser = () => {
  const navigate = useNavigate();
  const PASSWORD_RULE_TEXT = 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.';
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
    garmentId: '',
    companyEmail: '',
    userType: 'selection',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [chiefManagerGarmentIds, setChiefManagerGarmentIds] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadChiefManagerAssignments = async () => {
      try {
        const response = await apiClient.get('/users');
        const users = Array.isArray(response.data) ? response.data : [];
        const assigned = users
          .filter((user) => (user.role || user.userType) === 'CHIEF_MANAGER' && user.garmentId != null)
          .map((user) => Number(user.garmentId))
          .filter((garmentId) => Number.isInteger(garmentId));

        if (isActive) {
          setChiefManagerGarmentIds(Array.from(new Set(assigned)));
        }
      } catch {
        if (isActive) {
          setChiefManagerGarmentIds([]);
        }
      }
    };

    loadChiefManagerAssignments();

    return () => {
      isActive = false;
    };
  }, []);

  // Helper: calculate max date (18 years ago)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Validate age from dateOfBirth
  const validateAge = () => {
    const dob = formData.dateOfBirth;
    if (!dob) {
      setFormErrors(prev => ({ ...prev, dateOfBirth: 'Date of Birth is required' }));
      return false;
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setFormErrors(prev => ({ ...prev, dateOfBirth: 'User must be at least 18 years old' }));
      return false;
    } else {
      setFormErrors(prev => ({ ...prev, dateOfBirth: '' }));
      return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setSubmitError('');
  };

  const validateSecurityFields = () => {
    const nextErrors = {};
    if (!PASSWORD_REGEX.test(formData.password || '')) {
      nextErrors.password = PASSWORD_RULE_TEXT;
    }
    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Password does not match.';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateUserType = () => {
    if (formData.userType === 'selection') {
      setFormErrors((prev) => ({
        ...prev,
        userType: 'Please select a valid user type.',
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsConfirmOpen(false);
    if (!validateUserType()) return;
    if (!validateSecurityFields()) return;
    if (!validateAge()) return;  // Age validation added here

    const parsedGarmentId = parseGarmentId(formData.garmentId);
    if (formData.garmentId && parsedGarmentId === null) {
      setSubmitError('Garment ID must be a valid number.');
      return;
    }

    if (formData.userType === 'CHIEF_MANAGER' && parsedGarmentId !== null && chiefManagerGarmentIds.includes(parsedGarmentId)) {
      setSubmitError('Selected garment is already assigned to a Chief Manager.');
      return;
    }

    const payload = {
      name: formData.fullName.trim(),
      userType: formData.userType,
      dateOfBirth: formData.dateOfBirth,
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      companyEmail: formData.companyEmail.trim(),
      password: formData.password,
      garmentId: parsedGarmentId,
    };

    try {
      setIsSubmitting(true);
      setSubmitError('');
      await apiClient.post('/users', payload);
      navigate('/users');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add user. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConfirm = (event) => {
    event.preventDefault();
    if (!validateUserType()) {
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <section className="add-user-page">
      <PagePath items={[{ label: 'Users', to: '/users' }, { label: 'Add User' }]} />

      <form onSubmit={handleOpenConfirm} className="add-user-card">
        <div className="add-user-card-header">
          <span className="add-user-card-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </span>
          <div>
            <h2>User Details</h2>
            <p>Fill in the details to register a new user.</p>
          </div>
        </div>

        <div className="add-user-card-body">
          {/* Personal Details Section */}
          <div className="add-user-section">
            <div className="add-user-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h2>Personal Details</h2>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="fullName">
                  Full Name <span className="required-star" required>*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="add-user-field">
                <label htmlFor="userType">
                  User Type<span className="required-star" required>*</span>
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className={formErrors.userType ? 'field-error' : ''}
                  required
                >
                  <option value="selection" disabled>Select a User Type</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="CHIEF_MANAGER">Chief Manager</option>
                </select>
                {formErrors.userType && <span className="field-error-text">{formErrors.userType}</span>}
              </div>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="dateOfBirth">
                  Date Of Birth<span className="required-star" required>*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={validateAge}
                  max={getMaxDate()}
                  required
                />
                {formErrors.dateOfBirth && <span className="field-error-text">{formErrors.dateOfBirth}</span>}
              </div>

              <div className="add-user-field">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+94 7X XXX XXXX"
                  required
                />
              </div>
            </div>

            <div className="add-user-field">
              <label htmlFor="email">
                Email Address <span className="required-star" required>*</span>
              </label>              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@concord.com"
                required
              />
            </div>

            <div className="add-user-field">
              <label htmlFor="address">
                Address <span className="required-star" required>*</span>
              </label>              
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter residential address"
                rows="3"
                required
              />
            </div>
          </div>

          {/* Company Details Section */}
          <div className="add-user-section">
            <div className="add-user-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <h2>Company Details</h2>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <GenericLookupInput
                  id="garmentId"
                  name="garmentId"
                  label="Garment ID"
                  value={formData.garmentId}
                  onChange={handleInputChange}
                  error={formErrors.garmentId}
                  placeholder="Select or search Garment ID"
                  className="add-user-field"
                  endpoint="/locations/garments"
                  optionFilter={(garment) => {
                    if (formData.userType !== 'CHIEF_MANAGER') {
                      return true;
                    }
                    return !chiefManagerGarmentIds.includes(Number(garment.locationId));
                  }}
                  searchFields={[
                    (garment) => formatGarmentDisplayId(garment.locationId),
                    'locationId',
                    'name'
                  ]}
                  getOptionKey={(garment) => garment.locationId}
                  getOptionValue={(garment) => formatGarmentDisplayId(garment.locationId)}
                  getPrimaryText={(garment) => formatGarmentDisplayId(garment.locationId)}
                  getSecondaryText={(garment) => garment.name || '-'}
                  emptyMessage={formData.userType === 'CHIEF_MANAGER' ? 'No unassigned garments found' : 'No garments found'}
                  loadingMessage="Loading garments..."
                />
              </div>

              <div className="add-user-field">
                <label htmlFor="companyEmail">
                  Company Email <span className="required-star" required>*</span>
                </label>                
                <input
                  type="email"
                  id="companyEmail"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  placeholder="work.email@concord.com"
                  required
                />
              </div>
            </div>

            <div className="add-user-field add-user-narrow-field">
              <label htmlFor="userAddedDate">User Added Date</label>
              <input
                type="date"
                id="userAddedDate"
                name="userAddedDate"
                value={getCurrentDate()}
                disabled
              />
            </div>
          </div>

          {/* Account Security Section */}
          <div className="add-user-section">
            <div className="add-user-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <h2>Account Security</h2>
            </div>

            <div className="add-user-grid-two">
              <div className="add-user-field">
                <label htmlFor="Password">
                  Password <span className="required-star" required>*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={formErrors.password ? 'field-error' : ''}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && <span className="field-error-text">{formErrors.password}</span>}
              </div>

              <div className="add-user-field">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="required-star" required>*</span>
                </label>                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={formErrors.confirmPassword ? 'field-error' : ''}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && <span className="field-error-text">{formErrors.confirmPassword}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="add-user-actions">
          {submitError && <div className="add-user-submit-error">{submitError}</div>}
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            {isSubmitting ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>

      <ConfirmActionModal
        isOpen={isConfirmOpen}
        title="Confirm New User"
        message="Are you sure you want to add this user?"
        confirmLabel="Yes, Add User"
        cancelLabel="Cancel"
        variant="approve"
        isSubmitting={isSubmitting}
        onConfirm={handleSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <AppFooter />
    </section>
  );
};

export default AddUser;