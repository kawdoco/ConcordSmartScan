import "./StatsCards.css";

function IconMachines() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5" />
      <path d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

function IconGarment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 7 12 3 8 7 6 6 3 9l3 3v9h12v-9l3-3-3-3z" />
    </svg>
  );
}

function StatsCards() {
  const cards = [
    { label: "Total Machines", value: "4,821", icon: <IconMachines />, tone: "machines" },
    { label: "At Stores", value: "2,140", icon: <IconStore />, tone: "stores" },
    { label: "At Garments", value: "2,681", icon: <IconGarment />, tone: "garments" }
  ];

  return (
    <div className="stats-cards-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.label}>
          <div className={`stats-card-icon ${card.tone}`}>{card.icon}</div>
          <div className="stats-card-body">
            <p className="stats-card-label">{card.label}</p>
            <h2 className="stats-card-value">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;