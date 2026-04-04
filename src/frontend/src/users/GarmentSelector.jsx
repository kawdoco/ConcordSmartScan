import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/api';

const GarmentSelector = ({ value, onChange, error }) => {
  const [garments, setGarments] = useState([]);
  const [filteredGarments, setFilteredGarments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const containerRef = useRef(null);

  // Fetch garments on mount
  useEffect(() => {
    const fetchGarments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/locations/garments');
        setGarments(response.data || []);
        setFilteredGarments(response.data || []);
      } catch (err) {
        console.error('Failed to fetch garments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGarments();
  }, []);

  // Find selected garment when value changes
  useEffect(() => {
    if (value) {
      const selected = garments.find(g => g.locationId === Number(value));
      setSelectedGarment(selected || null);
    } else {
      setSelectedGarment(null);
    }
  }, [value, garments]);

  // Filter garments based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredGarments(garments);
    } else {
      const search = searchText.toLowerCase();
      const filtered = garments.filter(g =>
        g.name.toLowerCase().includes(search) ||
        g.locationId.toString().includes(search)
      );
      setFilteredGarments(filtered);
    }
  }, [searchText, garments]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectGarment = (garment) => {
    onChange(garment.locationId);
    setSelectedGarment(garment);
    setIsOpen(false);
    setSearchText('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSelectedGarment(null);
    setSearchText('');
  };

  return (
    <div className="garment-selector-container" ref={containerRef}>
      <div
        className={`garment-selector-input ${error ? 'error' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => !loading && setIsOpen(!isOpen)}
      >
        <div className="garment-selector-content">
          {selectedGarment ? (
            <span className="garment-selector-value">
              {selectedGarment.name} - {String(selectedGarment.locationId).padStart(3, '0')}
            </span>
          ) : (
            <span className="garment-selector-placeholder">Select or search garment...</span>
          )}
        </div>
        <div className="garment-selector-controls">
          {selectedGarment && (
            <button
              type="button"
              className="garment-selector-clear"
              onClick={handleClear}
              title="Clear selection"
            >
              ✕
            </button>
          )}
          <svg
            className="garment-selector-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="garment-selector-dropdown">
          <input
            type="text"
            className="garment-selector-search"
            placeholder="Search by name or ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />

          <div className="garment-selector-list">
            {loading ? (
              <div className="garment-selector-loading">Loading garments...</div>
            ) : filteredGarments.length === 0 ? (
              <div className="garment-selector-empty">
                {garments.length === 0
                  ? 'No garments available'
                  : 'No matching garments found'}
              </div>
            ) : (
              filteredGarments.map((garment) => (
                <div
                  key={garment.locationId}
                  className={`garment-selector-item ${
                    selectedGarment?.locationId === garment.locationId ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectGarment(garment)}
                >
                  <span className="garment-selector-item-name">{garment.name}</span>
                  <span className="garment-selector-item-id">
                    {String(garment.locationId).padStart(3, '0')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .garment-selector-container {
          position: relative;
          width: 100%;
        }

        .garment-selector-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 12px;
          background: #fff;
          cursor: pointer;
          font-family: inherit;
          font-size: 13.5px;
          color: #0f1623;
          transition: all 0.15s;
        }

        .garment-selector-input:hover {
          border-color: #b8c8f8;
        }

        .garment-selector-input:focus-within {
          border-color: #1a3fd4;
          box-shadow: 0 0 0 3px rgba(26, 63, 212, 0.05);
        }

        .garment-selector-input.open {
          border-color: #1a3fd4;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .garment-selector-input.error {
          border-color: #ef4444;
        }

        .garment-selector-content {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .garment-selector-value {
          color: #0f1623;
          font-weight: 500;
        }

        .garment-selector-placeholder {
          color: #6b7280;
        }

        .garment-selector-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .garment-selector-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: color 0.15s;
        }

        .garment-selector-clear:hover {
          color: #ef4444;
        }

        .garment-selector-arrow {
          color: #6b7280;
          transition: transform 0.15s;
        }

        .garment-selector-input.open .garment-selector-arrow {
          transform: rotate(180deg);
        }

        .garment-selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1.5px solid #1a3fd4;
          border-top: none;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          z-index: 10;
          display: flex;
          flex-direction: column;
          max-height: 300px;
          overflow: hidden;
        }

        .garment-selector-search {
          padding: 10px 12px;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          font-family: inherit;
          font-size: 13px;
          color: #0f1623;
          outline: none;
        }

        .garment-selector-search::placeholder {
          color: #6b7280;
        }

        .garment-selector-list {
          flex: 1;
          overflow-y: auto;
        }

        .garment-selector-loading,
        .garment-selector-empty {
          padding: 12px;
          text-align: center;
          color: #6b7280;
          font-size: 13px;
        }

        .garment-selector-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          cursor: pointer;
          transition: background-color 0.12s;
          border-bottom: 1px solid #f0f0f0;
        }

        .garment-selector-item:last-child {
          border-bottom: none;
        }

        .garment-selector-item:hover {
          background-color: #f8f9ff;
        }

        .garment-selector-item.selected {
          background-color: #eef1fd;
        }

        .garment-selector-item-name {
          flex: 1;
          font-weight: 500;
          color: #0f1623;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .garment-selector-item-id {
          color: #6b7280;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          margin-left: 12px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default GarmentSelector;
