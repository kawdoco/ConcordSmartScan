import React from "react";
import { Link } from "react-router-dom";

function PagePath({ items = [] }) {
  if (!items.length) return null;

  return (
    <div style={styles.row} role="navigation" aria-label="Page path">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {item.to ? (
            <Link to={item.to} style={styles.link}>{item.label}</Link>
          ) : (
            <span style={styles.current}>{item.label}</span>
          )}
          {index < items.length - 1 && <span style={styles.sep}>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "10px",
    fontSize: "12px"
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700
  },
  current: {
    color: "#64748b",
    fontWeight: 600
  },
  sep: {
    color: "#94a3b8"
  }
};

export default PagePath;
