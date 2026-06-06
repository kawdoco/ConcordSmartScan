import "./StatsCards.css";

const countByLocationPrefix = (machines, prefix) =>
  machines.filter((machine) =>
    machine.location?.toUpperCase().startsWith(prefix)
  ).length;

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

function IconTotalRequests() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function IconPurchaseRequests() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L22 7H7" />
    </svg>
  );
}

function IconTransferRequests() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 8h11" />
      <path d="M14 5l4 3-4 3" />
      <path d="M17 16H6" />
      <path d="M10 13l-4 3 4 3" />
    </svg>
  );
}

function StatsCards({ mode = "machines", counts, machines = [] }) {
  const totalMachines = machines.length;
  const storeMachines = countByLocationPrefix(machines, "ST");
  const garmentMachines = countByLocationPrefix(machines, "GR");
  const otherMachines = Math.max(0, totalMachines - storeMachines - garmentMachines);

  const cards = mode === "requests"
    ? [
        { label: "Total Requests", value: counts?.total ?? 0, icon: <IconTotalRequests />, tone: "requests-total" },
        { label: "Purchase Requests", value: counts?.purchase ?? 0, icon: <IconPurchaseRequests />, tone: "requests-purchase" },
        { label: "Transfer Requests", value: counts?.transfer ?? 0, icon: <IconTransferRequests />, tone: "requests-transfer" }
      ]
    : [
        { label: "Total Machines", value: totalMachines, icon: <IconMachines />, tone: "machines" },
        { label: "At Stores", value: storeMachines, icon: <IconStore />, tone: "stores" },
        { label: "At Garments", value: garmentMachines, icon: <IconGarment />, tone: "garments" },
        { label: "Other", value: otherMachines, icon: <IconMachines />, tone: "machines" }
      ];

  return (
    <div className="stats-cards-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.label}>
          <div className={`stats-card-icon ${card.tone}`}>{card.icon}</div>
          <div className="stats-card-body">
            <p className="stats-card-label">{card.label}</p>
            <h2 className="stats-card-value">{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;