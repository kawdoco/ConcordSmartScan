import React from "react";
import "./AppFooter.css";

function AppFooter() {
  return (
    <footer className="app-footer">
      <p className="app-footer-copy">© 2024 Concord Apparel Pvt Ltd. Machine Replacement Locator System.</p>
      <div className="app-footer-links">
        <button type="button">Privacy Policy</button>
        <button type="button">System Manual</button>
        <button type="button">Technical Support</button>
      </div>
    </footer>
  );
}

export default AppFooter;
