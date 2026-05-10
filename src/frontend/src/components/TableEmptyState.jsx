import React from 'react';
import './TableEmptyState.css';

const TableIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="12" y="18" width="40" height="30" rx="6" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 28H52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="22" cy="23" r="2" fill="currentColor" />
    <circle cx="28" cy="23" r="2" fill="currentColor" />
    <path d="M24 40H40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

function TableEmptyState({ message, minHeight = 392 }) {
  return (
    <div className="table-empty-state" role="status" aria-live="polite" style={{ minHeight }}>
      <div className="table-empty-illustration">
        <TableIcon />
      </div>
      <p>{message}</p>
    </div>
  );
}

export default TableEmptyState;
