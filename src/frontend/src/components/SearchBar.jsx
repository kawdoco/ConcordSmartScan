import React from "react";
import "./SearchBar.css";

function SearchIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  name = "search",
  inputRef,
  onFocus,
  className = "",
  size = "md",
  inputProps = {},
}) {
  const sizeClass = size === "sm" ? "search-bar-sm" : "search-bar-md";

  return (
    <div className={`search-bar ${sizeClass} ${className}`.trim()}>
      <span className="search-bar-icon">
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        {...inputProps}
      />
    </div>
  );
}
