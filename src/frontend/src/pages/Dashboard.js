import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const cards = [
    { label: "Registered Users", value: "124", tone: "#dbeafe" },
    { label: "Machines Tracked", value: "4,821", tone: "#dcfce7" },
    { label: "Pending Requests", value: "18", tone: "#fef3c7" },
    { label: "Active Locations", value: "42", tone: "#ede9fe" },
  ];

  const shortcuts = [
    { label: "Manage Users", to: "/users", desc: "Add, edit, and maintain registered system users." },
    { label: "View Machines", to: "/machines", desc: "Browse inventory and inspect machine details." },
    { label: "Add Machine", to: "/add", desc: "Create a new machine record in the system." },
    { label: "Profile", to: "/profile", desc: "Review your authenticated account information." },
  ];

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.kicker}>Welcome back</p>
          <h2 style={styles.heading}>{user?.email || "Administrator"}</h2>
          <p style={styles.copy}>
            This dashboard gives you a quick operational view of users, machines, and replacement workflow.
          </p>
        </div>
        <div style={styles.heroBadge}>Live Control Panel</div>
      </section>

      <section style={styles.grid}>
        {cards.map((card) => (
          <article key={card.label} style={{ ...styles.card, background: card.tone }}>
            <div style={styles.cardLabel}>{card.label}</div>
            <div style={styles.cardValue}>{card.value}</div>
          </article>
        ))}
      </section>

      <section style={styles.panelWrap}>
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Quick Actions</h3>
          <div style={styles.shortcutGrid}>
            {shortcuts.map((item) => (
              <Link key={item.label} to={item.to} style={styles.shortcut}>
                <div style={styles.shortcutTitle}>{item.label}</div>
                <div style={styles.shortcutDesc}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>System Notes</h3>
          <ul style={styles.notes}>
            <li style={styles.noteItem}>Only registered users can authenticate through the login page.</li>
            <li style={styles.noteItem}>Profile and Settings are available from the top-right dropdown.</li>
            <li style={styles.noteItem}>User management currently has its own dedicated screen layout.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "8px"
  },
  hero: {
    background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color: "#fff",
    borderRadius: "18px",
    padding: "28px",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    boxShadow: "0 18px 40px rgba(37, 99, 235, 0.22)"
  },
  kicker: {
    margin: 0,
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#bfdbfe",
    fontWeight: 700
  },
  heading: {
    margin: "8px 0 10px 0",
    fontSize: "2rem"
  },
  copy: {
    margin: 0,
    maxWidth: "640px",
    color: "#dbeafe",
    lineHeight: 1.6
  },
  heroBadge: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
    padding: "10px 14px",
    fontWeight: 700
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px"
  },
  card: {
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid rgba(148, 163, 184, 0.2)"
  },
  cardLabel: {
    color: "#334155",
    fontWeight: 700,
    fontSize: "0.92rem"
  },
  cardValue: {
    marginTop: "10px",
    fontSize: "2rem",
    color: "#0f172a",
    fontWeight: 800
  },
  panelWrap: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr",
    gap: "16px"
  },
  panel: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px"
  },
  panelTitle: {
    margin: "0 0 16px 0",
    color: "#0f172a"
  },
  shortcutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px"
  },
  shortcut: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    background: "#f8fafc"
  },
  shortcutTitle: {
    color: "#0f172a",
    fontWeight: 700,
    marginBottom: "8px"
  },
  shortcutDesc: {
    color: "#64748b",
    lineHeight: 1.5,
    fontSize: "0.92rem"
  },
  notes: {
    margin: 0,
    paddingLeft: "18px",
    color: "#475569",
    lineHeight: 1.8
  },
  noteItem: {
    marginBottom: "8px"
  }
};

export default Dashboard;