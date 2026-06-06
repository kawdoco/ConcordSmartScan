import React from "react";

const DEFAULT_STATUS_OPTIONS = [
  { value: "all", label: "All Requests" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" }
];

export default function RequestStatusFilter({
  filterId,
  value,
  onChange,
  className = "",
  selectClassName = "",
  label = "Filter by Status:",
  options = DEFAULT_STATUS_OPTIONS
}) {
  return (
    <div className={className}>
      <label htmlFor={filterId}>{label}</label>
      <select
        id={filterId}
        className={selectClassName}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}