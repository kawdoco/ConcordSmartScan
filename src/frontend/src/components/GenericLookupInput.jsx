import { useEffect, useMemo, useState } from "react";
import apiClient from "../services/api";
import "./GenericLookupInput.css";

function getValueByPath(item, path) {
  if (!path) {
    return "";
  }

  const keys = path.split(".");
  let current = item;
  for (const key of keys) {
    current = current?.[key];
    if (current === undefined || current === null) {
      return "";
    }
  }

  return current;
}

export default function GenericLookupInput({
  id,
  name,
  label,
  value,
  onChange,
  onSelectOption,
  error,
  placeholder = "",
  className = "new-request-field",
  modifierClassName = "",
  endpoint,
  searchFields = [],
  getOptionKey,
  getOptionValue,
  getPrimaryText,
  getSecondaryText,
  emptyMessage = "No results found",
  loadingMessage = "Loading...",
  maxResults = 50
}) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadOptions = async () => {
      if (!endpoint) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiClient.get(endpoint);
        if (isActive) {
          setOptions(Array.isArray(response.data) ? response.data : []);
        }
      } catch {
        if (isActive) {
          setOptions([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      isActive = false;
    };
  }, [endpoint]);

  const searchText = String(value || "").trim().toLowerCase();
  const suggestions = useMemo(() => {
    return options
      .filter((option) => {
        if (!searchText) {
          return true;
        }

        const indexedValues = searchFields.map((field) => {
          if (typeof field === "function") {
            return field(option);
          }
          return getValueByPath(option, field);
        });

        return indexedValues.some((entry) => String(entry || "").toLowerCase().includes(searchText));
      })
      .slice(0, maxResults);
  }, [options, searchFields, searchText, maxResults]);

  const emitChange = (nextValue) => {
    if (!onChange) {
      return;
    }

    onChange({
      target: {
        name,
        value: nextValue
      }
    });
  };

  const handleInputChange = (event) => {
    emitChange(event.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = (option) => {
    const nextValue = getOptionValue ? getOptionValue(option) : "";
    emitChange(nextValue);
    if (onSelectOption) {
      onSelectOption(option);
    }
    setShowSuggestions(false);
  };

  return (
    <div className={`${className} generic-lookup-field ${modifierClassName}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false);
          }, 120);
        }}
        placeholder={placeholder}
        className={error ? "error" : ""}
        autoComplete="off"
      />

      {showSuggestions && (
        <div className="generic-lookup-suggestion-box" role="listbox" aria-label={`${label} suggestions`}>
          {isLoading ? (
            <div className="generic-lookup-suggestion-empty">{loadingMessage}</div>
          ) : suggestions.length === 0 ? (
            <div className="generic-lookup-suggestion-empty">{emptyMessage}</div>
          ) : (
            suggestions.map((option) => (
              <button
                key={getOptionKey(option)}
                type="button"
                className="generic-lookup-suggestion-item"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(option);
                }}
              >
                <span className="generic-lookup-suggestion-id">{getPrimaryText(option)}</span>
                {getSecondaryText && (
                  <span className="generic-lookup-suggestion-meta">{getSecondaryText(option)}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && <span className="new-request-error">{error}</span>}
    </div>
  );
}
