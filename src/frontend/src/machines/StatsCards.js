import "./StatsCards.css";

function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconFactory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 20h20" />
      <path d="M7 20V8l5 4V8l5 4V4" />
      <path d="M2 20V10l5-2" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function StatsCards({ machines = [] }) {
  const total      = machines.length;
  const atStores   = machines.filter((m) => m.location?.toUpperCase().startsWith("ST")).length;
  const atGarments = machines.filter((m) => m.location?.toUpperCase().startsWith("GR")).length;
  const other      = total - atStores - atGarments;

  const stats = [
    {
      label: "Total Machines",
      value: total,
      icon: <IconBox />,
      color: "blue",
    },
    {
      label: "At Stores",
      value: atStores,
      icon: <IconStore />,
      color: "green",
    },
    {
      label: "At Garments",
      value: atGarments,
      icon: <IconFactory />,
      color: "amber",
    },
    {
      label: "Other",
      value: other,
      icon: <IconWrench />,
      color: "slate",
    },
  ];

  return (
    <div className="stats-cards-row">
      {stats.map(({ label, value, icon, color }) => (
        <div key={label} className={`stats-card stats-card--${color}`}>
          <div className="stats-card-icon">{icon}</div>
          <div className="stats-card-body">
            <span className="stats-card-label">{label}</span>
            <span className="stats-card-value">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
