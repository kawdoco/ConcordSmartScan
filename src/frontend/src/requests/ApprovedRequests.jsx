import { useState, useCallback } from "react";

/* ─── Extra styles (extends UserManagement's shared styles) ──────────────────── */
const extraStyle = `
  :root {
    --blue:#1a3fd4; --blue-dk:#1230a8; --blue-lt:#eef1fd;
    --text:#0f1623; --muted:#6b7280; --border:#e5e7eb;
    --bg:#f4f6fb; --white:#fff;
  }

  .content { padding: 28px 28px; flex: 1; color: var(--text); font-family: 'Sora', sans-serif; }

  .tabs {
    display:flex;
    border-bottom:1.5px solid var(--border);
    margin-bottom:20px;
  }
  .tab {
    padding:10px 20px;
    font-weight:500;
    font-size:13.5px;
    cursor:pointer;
    border-bottom:2.5px solid transparent;
    color:var(--muted);
    transition:all .15s;
    user-select:none;
    background:none;
    border-top:none;
    border-left:none;
    border-right:none;
    font-family:inherit;
    margin-bottom:-1.5px;
  }
  .tab:hover:not(.tab-active) { color:var(--text); }
  .tab-active { color:var(--blue); border-bottom-color:var(--blue); }

  .card {
    background:var(--white);
    border:1px solid var(--border);
    border-radius:12px;
    overflow:hidden;
  }
  .card-hd {
    padding:18px 22px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    border-bottom:1px solid var(--border);
  }
  .card-hd .ct { font-weight:700; font-size:15px; }
  .card-hd .cs { font-size:12px; color:var(--muted); margin-top:2px; }

  table { width:100%; border-collapse:collapse; }
  thead th {
    font-size:11px;
    font-weight:600;
    color:var(--muted);
    text-transform:uppercase;
    letter-spacing:.07em;
    padding:11px 20px;
    text-align:left;
    border-bottom:1px solid var(--border);
    background:var(--bg);
  }
  tbody tr { transition:background .12s; }
  tbody tr:hover { background:#f8f9ff; }
  tbody td {
    padding:15px 20px;
    border-bottom:1px solid var(--border);
    font-size:13.5px;
  }
  tbody tr:last-child td { border-bottom:none; }

  .tfoot {
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:13px 20px;
    border-top:1px solid var(--border);
    font-size:13px;
    color:var(--muted);
  }
  .pagination { display:flex; align-items:center; gap:4px; }
  .pg-btn {
    min-width:32px;
    height:32px;
    border-radius:7px;
    border:1.5px solid var(--border);
    background:var(--white);
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:13px;
    font-weight:500;
    color:var(--muted);
    transition:all .12s;
    padding:0 8px;
    font-family:inherit;
  }
  .pg-btn.pg-active { background:var(--blue); color:#fff; border-color:var(--blue); }
  .pg-btn:hover:not(.pg-active):not(:disabled) { background:var(--bg); color:var(--text); }
  .pg-btn:disabled { opacity:.35; cursor:default; }

  .empty { text-align:center; padding:60px 20px; color:var(--muted); }

  .toast {
    position:fixed;
    bottom:24px;
    right:24px;
    z-index:400;
    padding:13px 20px;
    border-radius:10px;
    font-size:13px;
    font-weight:600;
    font-family:'Sora',sans-serif;
    box-shadow:0 8px 28px rgba(0,0,0,.18);
    transform:translateY(80px);
    opacity:0;
    transition:all .3s cubic-bezier(.34,1.56,.64,1);
    pointer-events:none;
  }
  .toast.visible { transform:translateY(0); opacity:1; }
  .toast-success { background:#065f46; color:#fff; }
  .toast-error { background:#991b1b; color:#fff; }
  .toast-info { background:var(--blue-dk); color:#fff; }

  /* ── Request-specific styles ── */
  .req-section-title { font-size:24px; font-weight:700; margin-bottom:6px; letter-spacing:-.4px; }
  .req-section-sub   { font-size:13px; color:var(--muted); margin-bottom:24px; }

  .btn-export {
    display:flex; align-items:center; gap:8px;
    background:var(--white); color:var(--text);
    border:1.5px solid var(--border); border-radius:8px;
    padding:9px 16px; font-family:inherit; font-size:13px;
    font-weight:600; cursor:pointer; transition:all .15s;
  }
  .btn-export:hover { background:var(--bg); border-color:#bdc8e8; }

  .th-sub { font-size:10px; font-weight:500; color:var(--muted); text-transform:none;
            letter-spacing:0; display:block; margin-top:2px; }

  .req-id  { font-family:'JetBrains Mono',monospace; font-size:12.5px; font-weight:700; color:var(--text); }
  .mc-id   { font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--muted); }
  .store-id { font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--muted); }
  .approval-date  { font-size:13px; }
  .approval-cm    { font-size:11.5px; color:var(--muted); margin-top:1px; }

  .btn-edit-machine {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:7px;
    border:1.5px solid var(--blue); background:var(--white);
    color:var(--blue); font-family:inherit; font-size:12.5px;
    font-weight:600; cursor:pointer; transition:all .15s;
  }
  .btn-edit-machine:hover { background:var(--blue-lt); }

  /* Purchase requests */
  .btn-add-machine {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:7px;
    border:none; background:var(--blue);
    color:#fff; font-family:inherit; font-size:12.5px;
    font-weight:600; cursor:pointer; transition:background .15s;
  }
  .btn-add-machine:hover { background:var(--blue-dk); }

  .machine-added {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:7px;
    color:var(--muted); font-family:inherit; font-size:12.5px; font-weight:600;
  }
  .machine-added svg { color:var(--muted); }

  tr.row-done td { color:#9ca3af; }
  tr.row-done .prq-id { color:#9ca3af; }
`;

/* ─── Purchase mock data ────────────────────────────────────────────────────── */
const ALL_PURCHASE_REQUESTS = [
  { id: "PRQ-4401", machineType: "Double Needle Lockstitch",  garment: "GR-005 (Polo Shirt)",    approvalDate: "2024-05-20", cmId: "CM-202", added: false },
  { id: "PRQ-4405", machineType: "Overlock Sewing Machine",   garment: "GR-001 (Denim Jacket)",  approvalDate: "2024-05-19", cmId: "CM-202", added: false },
  { id: "PRQ-4399", machineType: "Buttonhole Machine",        garment: "GR-012 (Formal Shirt)",  approvalDate: "2024-05-10", cmId: "CM-215", added: true  },
  { id: "PRQ-4412", machineType: "Interlock Machine",         garment: "GR-003 (Cotton Crew)",   approvalDate: "2024-05-18", cmId: "CM-202", added: false },
  { id: "PRQ-4418", machineType: "Flatlock Machine",          garment: "GR-007 (Casual Tee)",    approvalDate: "2024-05-17", cmId: "CM-215", added: false },
  { id: "PRQ-4422", machineType: "Chain Stitch Machine",      garment: "GR-004 (Chino Pants)",   approvalDate: "2024-05-17", cmId: "CM-262", added: false },
  { id: "PRQ-4426", machineType: "Blind Stitch Machine",      garment: "GR-008 (Formal Shirt)",  approvalDate: "2024-05-16", cmId: "CM-215", added: true  },
  { id: "PRQ-4430", machineType: "Bartacking Machine",        garment: "GR-006 (Track Jacket)",  approvalDate: "2024-05-16", cmId: "CM-262", added: false },
  { id: "PRQ-4434", machineType: "Button Sewing Machine",     garment: "GR-009 (Bomber Jacket)", approvalDate: "2024-05-15", cmId: "CM-215", added: false },
  { id: "PRQ-4438", machineType: "Zigzag Machine",            garment: "GR-010 (Hoodie)",        approvalDate: "2024-05-15", cmId: "CM-262", added: true  },
  { id: "PRQ-4442", machineType: "Feed-off-the-arm Machine",  garment: "GR-011 (Windbreaker)",   approvalDate: "2024-05-14", cmId: "CM-243", added: false },
  { id: "PRQ-4446", machineType: "Cover Stitch Machine",      garment: "GR-002 (Linen Pants)",   approvalDate: "2024-05-13", cmId: "CM-215", added: false },
];

/* ─── Transfer mock data ─────────────────────────────────────────────────────── */
const ALL_TRANSFER_REQUESTS = [
  { id: "REQ-2201", machineId: "MC-9042", storeId: "ST-101", garment: "GR-005 (Polo Shirt)",    approvalDate: "2024-05-20", cmId: "CM-262" },
  { id: "REQ-2205", machineId: "MC-4412", storeId: "ST-104", garment: "GR-001 (Denim Jacket)",  approvalDate: "2024-05-19", cmId: "CM-262" },
  { id: "REQ-2210", machineId: "MC-8210", storeId: "ST-102", garment: "GR-003 (Cotton Crew)",   approvalDate: "2024-05-18", cmId: "CM-215" },
  { id: "REQ-2214", machineId: "MC-1104", storeId: "ST-108", garment: "GR-002 (Linen Pants)",   approvalDate: "2024-05-18", cmId: "CM-262" },
  { id: "REQ-2218", machineId: "MC-3301", storeId: "ST-103", garment: "GR-007 (Casual Tee)",    approvalDate: "2024-05-17", cmId: "CM-215" },
  { id: "REQ-2222", machineId: "MC-7720", storeId: "ST-106", garment: "GR-004 (Chino Pants)",   approvalDate: "2024-05-17", cmId: "CM-262" },
  { id: "REQ-2226", machineId: "MC-5510", storeId: "ST-107", garment: "GR-008 (Formal Shirt)",  approvalDate: "2024-05-16", cmId: "CM-215" },
  { id: "REQ-2230", machineId: "MC-2201", storeId: "ST-109", garment: "GR-006 (Track Jacket)",  approvalDate: "2024-05-16", cmId: "CM-262" },
  { id: "REQ-2234", machineId: "MC-6680", storeId: "ST-110", garment: "GR-009 (Bomber Jacket)", approvalDate: "2024-05-15", cmId: "CM-215" },
  { id: "REQ-2238", machineId: "MC-4490", storeId: "ST-111", garment: "GR-010 (Hoodie)",        approvalDate: "2024-05-15", cmId: "CM-262" },
  { id: "REQ-2242", machineId: "MC-3350", storeId: "ST-112", garment: "GR-011 (Windbreaker)",   approvalDate: "2024-05-14", cmId: "CM-243" },
  { id: "REQ-2246", machineId: "MC-8801", storeId: "ST-113", garment: "GR-012 (Denim Shorts)",  approvalDate: "2024-05-14", cmId: "CM-243" },
  { id: "REQ-2250", machineId: "MC-1230", storeId: "ST-114", garment: "GR-013 (Cargo Pants)",   approvalDate: "2024-05-13", cmId: "CM-215" },
  { id: "REQ-2254", machineId: "MC-9910", storeId: "ST-115", garment: "GR-014 (Sweatshirt)",    approvalDate: "2024-05-13", cmId: "CM-262" },
  { id: "REQ-2258", machineId: "MC-7741", storeId: "ST-116", garment: "GR-015 (Oxford Shirt)",  approvalDate: "2024-05-12", cmId: "CM-243" },
  { id: "REQ-2262", machineId: "MC-5560", storeId: "ST-117", garment: "GR-016 (Jogger Pants)",  approvalDate: "2024-05-12", cmId: "CM-215" },
  { id: "REQ-2266", machineId: "MC-2270", storeId: "ST-118", garment: "GR-017 (Tank Top)",      approvalDate: "2024-05-11", cmId: "CM-262" },
  { id: "REQ-2270", machineId: "MC-4430", storeId: "ST-119", garment: "GR-018 (Sports Shorts)", approvalDate: "2024-05-11", cmId: "CM-243" },
  { id: "REQ-2274", machineId: "MC-6690", storeId: "ST-120", garment: "GR-019 (Fleece Vest)",   approvalDate: "2024-05-10", cmId: "CM-215" },
  { id: "REQ-2278", machineId: "MC-1120", storeId: "ST-121", garment: "GR-020 (Trench Coat)",   approvalDate: "2024-05-10", cmId: "CM-262" },
  { id: "REQ-2282", machineId: "MC-8830", storeId: "ST-122", garment: "GR-021 (Slim Jeans)",    approvalDate: "2024-05-09", cmId: "CM-243" },
  { id: "REQ-2286", machineId: "MC-3370", storeId: "ST-123", garment: "GR-022 (Graphic Tee)",   approvalDate: "2024-05-09", cmId: "CM-215" },
  { id: "REQ-2290", machineId: "MC-7750", storeId: "ST-124", garment: "GR-023 (Linen Shirt)",   approvalDate: "2024-05-08", cmId: "CM-262" },
  { id: "REQ-2294", machineId: "MC-5520", storeId: "ST-125", garment: "GR-024 (Puffer Jacket)", approvalDate: "2024-05-08", cmId: "CM-243" },
];

const ROWS_PER_PAGE = 4;

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
const PencilIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShoppingIcon = () => (
  <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/* ─── ChevLeft / ChevRight ───────────────────────────────────────────────────── */
const PlusIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevLeft = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ─── Toast ──────────────────────────────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }, []);
  return [toast, showToast];
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function ApprovedRequests() {
  const [requestTab, setRequestTab] = useState("transfer");
  const [page, setPage] = useState(1);
  const [purchasePage, setPurchasePage] = useState(1);
  const [searchQ, setSearchQ] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState(ALL_PURCHASE_REQUESTS);
  const [toast, showToast] = useToast();

  /* ── Filtering ── */
  const filtered = ALL_TRANSFER_REQUESTS.filter(r => {
    const q = searchQ.toLowerCase();
    return !q
      || r.id.toLowerCase().includes(q)
      || r.machineId.toLowerCase().includes(q)
      || r.storeId.toLowerCase().includes(q)
      || r.garment.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paged = filtered.slice((safeP - 1) * ROWS_PER_PAGE, safeP * ROWS_PER_PAGE);

  const getPagesArr = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (safeP > 3) pages.push("...");
    for (let i = Math.max(2, safeP - 1); i <= Math.min(totalPages - 1, safeP + 1); i++) pages.push(i);
    if (safeP < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  /* ── Purchase filtering & pagination ── */
  const filteredPurchase = purchaseRequests.filter(r => {
    const q = searchQ.toLowerCase();
    return !q
      || r.id.toLowerCase().includes(q)
      || r.machineType.toLowerCase().includes(q)
      || r.garment.toLowerCase().includes(q);
  });
  const purchaseTotalPages = Math.max(1, Math.ceil(filteredPurchase.length / ROWS_PER_PAGE));
  const safePurchasePage = Math.min(purchasePage, purchaseTotalPages);
  const pagedPurchase = filteredPurchase.slice(
    (safePurchasePage - 1) * ROWS_PER_PAGE, safePurchasePage * ROWS_PER_PAGE
  );
  const getPurchasePagesArr = () => {
    if (purchaseTotalPages <= 6) return Array.from({ length: purchaseTotalPages }, (_, i) => i + 1);
    const pages = [1];
    if (safePurchasePage > 3) pages.push("...");
    for (let i = Math.max(2, safePurchasePage - 1); i <= Math.min(purchaseTotalPages - 1, safePurchasePage + 1); i++) pages.push(i);
    if (safePurchasePage < purchaseTotalPages - 2) pages.push("...");
    pages.push(purchaseTotalPages);
    return pages;
  };

  const handleAddMachine = (id) => {
    setPurchaseRequests(prev =>
      prev.map(r => r.id === id ? { ...r, added: true } : r)
    );
    showToast(`Machine added for ${id}`, "success");
  };

  const handleTabChange = (tab) => {
    setRequestTab(tab);
    setPage(1);
    setPurchasePage(1);
  };

  const handleExport = () => {
    const headers = ["REQUEST ID,MACHINE ID,STORE ID,REQUESTED GARMENT,APPROVAL DATE,CM ID"];
    const rows = filtered.map(r =>
      `${r.id},${r.machineId},${r.storeId},"${r.garment}",${r.approvalDate},${r.cmId}`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "approved_transfer_requests.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Export successful", "success");
  };

  return (
    <>
      <style>{extraStyle}</style>

      <div className="content">
        <h1 className="req-section-title">Approved Requests</h1>

        {/* ── Tabs ── */}
        <div className="tabs">
          <button
            className={`tab${requestTab === "transfer" ? " tab-active" : ""}`}
            onClick={() => handleTabChange("transfer")}>
            Transfer Requests
          </button>
          <button
            className={`tab${requestTab === "purchase" ? " tab-active" : ""}`}
            onClick={() => handleTabChange("purchase")}>
            Purchase Requests
          </button>
        </div>

        {/* ── Transfer Requests ── */}
        {requestTab === "transfer" && (
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="ct">Machine Transfers</div>
                <div className="cs">Manage internal machine relocations across different store locations.</div>
              </div>
              <button className="btn-export" onClick={handleExport}>
                <DownloadIcon /> Export
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine ID</th>
                  <th>Store ID</th>
                  <th>Requested Garment</th>
                  <th>
                    Approval
                    <span className="th-sub">Date | CM ID</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty">
                        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <p style={{ marginTop: 12, fontWeight: 600 }}>No approved requests found</p>
                        <p style={{ fontSize: 13, marginTop: 4 }}>
                          {searchQ ? "Try a different search term." : "No transfer requests have been approved yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paged.map(r => (
                  <tr key={r.id}>
                    <td><span className="req-id">{r.id}</span></td>
                    <td><span className="mc-id">{r.machineId}</span></td>
                    <td><span className="store-id">{r.storeId}</span></td>
                    <td>{r.garment}</td>
                    <td>
                      <div className="approval-date">{r.approvalDate}</div>
                      <div className="approval-cm">{r.cmId}</div>
                    </td>
                    <td>
                      <button
                        className="btn-edit-machine"
                        onClick={() => showToast(`Editing machine ${r.machineId}`, "info")}>
                        <PencilIcon /> Edit Machine
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="tfoot">
              <span>
                {filtered.length === 0
                  ? "No transfer requests"
                  : `Showing ${(safeP - 1) * ROWS_PER_PAGE + 1} to ${Math.min(safeP * ROWS_PER_PAGE, filtered.length)} of ${filtered.length} transfer request${filtered.length !== 1 ? "s" : ""}`}
              </span>
              <div className="pagination">
                <button className="pg-btn" disabled={safeP === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevLeft />
                </button>
                {getPagesArr().map((p, i) =>
                  p === "..." ? (
                    <button key={`dots-${i}`} className="pg-btn" disabled>…</button>
                  ) : (
                    <button
                      key={p}
                      className={`pg-btn${safeP === p ? " pg-active" : ""}`}
                      onClick={() => setPage(p)}>
                      {p}
                    </button>
                  )
                )}
                <button className="pg-btn" disabled={safeP === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Purchase Requests ── */}
        {requestTab === "purchase" && (
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="ct">External Machine Purchases</div>
                <div className="cs">Fulfill approved purchase requests by adding new machines to the inventory.</div>
              </div>
              <button className="btn-export" onClick={() => {
                const headers = ["REQUEST ID,MACHINE TYPE,GARMENT REQUESTED,APPROVAL DATE,CM ID,STATUS"];
                const rows = filteredPurchase.map(r =>
                  `${r.id},"${r.machineType}","${r.garment}",${r.approvalDate},${r.cmId},${r.added ? "Added" : "Pending"}`
                );
                const csv = [...headers, ...rows].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "approved_purchase_requests.csv"; a.click();
                URL.revokeObjectURL(url);
                showToast("Export successful", "success");
              }}>
                <DownloadIcon /> Export
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine Type</th>
                  <th>Garment Requested</th>
                  <th>Approval (Date | CM ID)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPurchase.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty">
                        <ShoppingIcon />
                        <p style={{ marginTop: 12, fontWeight: 600 }}>No purchase requests found</p>
                        <p style={{ fontSize: 13, marginTop: 4 }}>
                          {searchQ ? "Try a different search term." : "No purchase requests have been approved yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : pagedPurchase.map(r => (
                  <tr key={r.id} className={r.added ? "row-done" : ""}>
                    <td><span className="req-id prq-id">{r.id}</span></td>
                    <td>{r.machineType}</td>
                    <td>{r.garment}</td>
                    <td>
                      <div className="approval-date">{r.approvalDate} | {r.cmId}</div>
                    </td>
                    <td>
                      {r.added ? (
                        <span className="machine-added">
                          <CheckIcon /> Machine Added
                        </span>
                      ) : (
                        <button
                          className="btn-add-machine"
                          onClick={() => handleAddMachine(r.id)}>
                          <PlusIcon /> Add Machine
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="tfoot">
              <span>
                {filteredPurchase.length === 0
                  ? "No purchase requests"
                  : `Showing ${(safePurchasePage - 1) * ROWS_PER_PAGE + 1} to ${Math.min(safePurchasePage * ROWS_PER_PAGE, filteredPurchase.length)} of ${filteredPurchase.length} purchase request${filteredPurchase.length !== 1 ? "s" : ""}`}
              </span>
              <div className="pagination">
                <button className="pg-btn" disabled={safePurchasePage === 1} onClick={() => setPurchasePage(p => p - 1)}>
                  <ChevLeft />
                </button>
                {getPurchasePagesArr().map((p, i) =>
                  p === "..." ? (
                    <button key={`dots-${i}`} className="pg-btn" disabled>…</button>
                  ) : (
                    <button
                      key={p}
                      className={`pg-btn${safePurchasePage === p ? " pg-active" : ""}`}
                      onClick={() => setPurchasePage(p)}>
                      {p}
                    </button>
                  )
                )}
                <button className="pg-btn" disabled={safePurchasePage === purchaseTotalPages} onClick={() => setPurchasePage(p => p + 1)}>
                  <ChevRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Toast ── */}
      <div className={`toast toast-${toast.type}${toast.visible ? " visible" : ""}`}>{toast.msg}</div>
    </>
  );
}
