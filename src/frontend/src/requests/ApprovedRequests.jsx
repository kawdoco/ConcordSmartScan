import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StatsCards from "../components/StatsCards";
import "./ApprovedRequests.css";

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
  const navigate = useNavigate();
  const [requestTab, setRequestTab] = useState("transfer");
  const [page, setPage] = useState(1);
  const [purchasePage, setPurchasePage] = useState(1);
  const [searchQ, setSearchQ] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState(ALL_PURCHASE_REQUESTS);
  const [toast, showToast] = useToast();

  const purchaseCount = purchaseRequests.length;
  const transferCount = ALL_TRANSFER_REQUESTS.length;
  const totalRequestCount = purchaseCount + transferCount;

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
    const selectedRequest = purchaseRequests.find(r => r.id === id);
    navigate("/add", {
      state: {
        from: "approved-requests",
        request: selectedRequest || null,
      },
    });
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
    <div className="approved-requests-page">
      <div className="content">
        <StatsCards
          mode="requests"
          counts={{
            total: totalRequestCount,
            purchase: purchaseCount,
            transfer: transferCount,
          }}
        />

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
                        <p className="empty-title">No approved requests found</p>
                        <p className="empty-sub">
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
                        onClick={() => navigate(`/edit/${r.machineId}`)}>
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
                  <th>
                    Approval
                    <span className="th-sub">Date | CM ID</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPurchase.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty">
                        <ShoppingIcon />
                        <p className="empty-title">No purchase requests found</p>
                        <p className="empty-sub">
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
                      <div className="approval-date">{r.approvalDate}</div>
                      <div className="approval-cm">{r.cmId}</div>
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
    </div>
  );
}
