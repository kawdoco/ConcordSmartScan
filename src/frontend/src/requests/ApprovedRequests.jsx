import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import StatsCards from "../components/StatsCards";
import apiClient from "../services/api";
import { formatUserId } from "../users/userId";
import "./ApprovedRequests.css";

const ROWS_PER_PAGE = 4;

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

const PlusIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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

function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast((previous) => ({ ...previous, visible: false })), 3000);
  }, []);
  return [toast, showToast];
}

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toISOString().slice(0, 10);
};

const toTitleCase = (value) => {
  if (!value) return "-";
  return String(value)
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (char) => char.toUpperCase());
};

export default function ApprovedRequests() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get("q") || "";
  const [requestTab, setRequestTab] = useState("transfer");
  const [page, setPage] = useState(1);
  const [purchasePage, setPurchasePage] = useState(1);
  const [transferRequests, setTransferRequests] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, showToast] = useToast();

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const [transferResponse, purchaseResponse] = await Promise.all([
          apiClient.get("/requests", { params: { type: "transfer", status: "approved" } }),
          apiClient.get("/requests", { params: { type: "purchase", status: "approved" } })
        ]);

        const normalizedTransfer = Array.isArray(transferResponse.data)
          ? transferResponse.data.map((row) => ({
              id: row.id,
              requestCode: row.requestCode,
              machineId: row.machineId || "-",
              storeId: row.fromStoreId || "-",
              garment: row.toGarmentId || "-",
              approvedByManagerId: formatUserId(row.approvedByManagerId),
              approvalDate: formatDate(row.createdAt),
              approvalMeta: `Priority: ${toTitleCase(row.priority)}`
            }))
          : [];

        const normalizedPurchase = Array.isArray(purchaseResponse.data)
          ? purchaseResponse.data.map((row) => ({
              id: row.id,
              requestCode: row.requestCode,
              machineType: row.machineType || "-",
              garment: row.toGarmentId || "-",
              approvedByManagerId: formatUserId(row.approvedByManagerId),
              approvalDate: formatDate(row.createdAt),
              approvalMeta: `Priority: ${toTitleCase(row.priority)}`
            }))
          : [];

        setTransferRequests(normalizedTransfer);
        setPurchaseRequests(normalizedPurchase);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load approved requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  const purchaseCount = purchaseRequests.length;
  const transferCount = transferRequests.length;
  const totalRequestCount = purchaseCount + transferCount;

  const filtered = transferRequests.filter((row) => {
    const q = searchQ.trim().toLowerCase();
    return !q
      || row.requestCode.toLowerCase().includes(q)
      || row.machineId.toLowerCase().includes(q)
      || row.garment.toLowerCase().includes(q)
      || row.storeId.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safeP = Math.min(page, totalPages);
  const paged = filtered.slice((safeP - 1) * ROWS_PER_PAGE, safeP * ROWS_PER_PAGE);

  const getPagesArr = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const pages = [1];
    if (safeP > 3) pages.push("...");
    for (let index = Math.max(2, safeP - 1); index <= Math.min(totalPages - 1, safeP + 1); index += 1) {
      pages.push(index);
    }
    if (safeP < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const filteredPurchase = purchaseRequests.filter((row) => {
    const q = searchQ.trim().toLowerCase();
    return !q
      || row.requestCode.toLowerCase().includes(q)
      || row.machineType.toLowerCase().includes(q)
      || row.garment.toLowerCase().includes(q);
  });

  const purchaseTotalPages = Math.max(1, Math.ceil(filteredPurchase.length / ROWS_PER_PAGE));
  const safePurchasePage = Math.min(purchasePage, purchaseTotalPages);
  const pagedPurchase = filteredPurchase.slice(
    (safePurchasePage - 1) * ROWS_PER_PAGE,
    safePurchasePage * ROWS_PER_PAGE
  );

  const getPurchasePagesArr = () => {
    if (purchaseTotalPages <= 6) return Array.from({ length: purchaseTotalPages }, (_, index) => index + 1);
    const pages = [1];
    if (safePurchasePage > 3) pages.push("...");
    for (
      let index = Math.max(2, safePurchasePage - 1);
      index <= Math.min(purchaseTotalPages - 1, safePurchasePage + 1);
      index += 1
    ) {
      pages.push(index);
    }
    if (safePurchasePage < purchaseTotalPages - 2) pages.push("...");
    pages.push(purchaseTotalPages);
    return pages;
  };

  const handleAddMachine = (id) => {
    const selectedRequest = purchaseRequests.find((row) => row.id === id);
    navigate("/add", {
      state: {
        from: "approved-requests",
        request: selectedRequest || null
      }
    });
  };

  const handleTabChange = (tab) => {
    setRequestTab(tab);
    setPage(1);
    setPurchasePage(1);
  };

  const handleExportTransfer = () => {
    const headers = ["REQUEST ID,MACHINE ID,REQUESTED GARMENT,APPROVED BY MANAGER ID,APPROVED DATE,PRIORITY"];
    const rows = filtered.map((row) =>
      `${row.requestCode},${row.machineId},"${row.garment}",${row.approvedByManagerId},${row.approvalDate},"${row.approvalMeta}"`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "approved_transfer_requests.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Export successful", "success");
  };

  const handleExportPurchase = () => {
    const headers = ["REQUEST ID,MACHINE TYPE,GARMENT REQUESTED,APPROVED BY MANAGER ID,APPROVED DATE,PRIORITY"];
    const rows = filteredPurchase.map((row) =>
      `${row.requestCode},"${row.machineType}","${row.garment}",${row.approvedByManagerId},${row.approvalDate},"${row.approvalMeta}"`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "approved_purchase_requests.csv";
    anchor.click();
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
            transfer: transferCount
          }}
        />

        <div className="tabs">
          <button
            className={`tab${requestTab === "transfer" ? " tab-active" : ""}`}
            onClick={() => handleTabChange("transfer")}
          >
            Transfer Requests
          </button>
          <button
            className={`tab${requestTab === "purchase" ? " tab-active" : ""}`}
            onClick={() => handleTabChange("purchase")}
          >
            Purchase Requests
          </button>
        </div>

        {requestTab === "transfer" && (
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="ct">Machine Transfers</div>
                <div className="cs">Manage internal machine relocations across different store locations.</div>
              </div>
              <button className="btn-export" onClick={handleExportTransfer}>
                <DownloadIcon /> Export
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine ID</th>
                  <th>Requested Garment</th>
                  <th>Approved By (Manager ID)</th>
                  <th>
                    Approval
                    <span className="th-sub">Date | Priority</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty">
                        <p className="empty-title">Loading approved requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty">
                        <p className="empty-title">No approved requests found</p>
                        <p className="empty-sub">{error || "No transfer requests have been approved yet."}</p>
                      </div>
                    </td>
                  </tr>
                ) : paged.map((row) => (
                  <tr key={row.id}>
                    <td><span className="req-id">{row.requestCode}</span></td>
                    <td><span className="mc-id">{row.machineId}</span></td>
                    <td>{row.garment}</td>
                    <td><span className="mc-id">{row.approvedByManagerId}</span></td>
                    <td>
                      <div className="approval-date">{row.approvalDate}</div>
                      <div className="approval-cm">{row.approvalMeta}</div>
                    </td>
                    <td>
                      <button
                        className="btn-edit-machine"
                        onClick={() => navigate(`/edit/${row.machineId}`)}
                      >
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
                <button className="pg-btn" disabled={safeP === 1} onClick={() => setPage((previous) => previous - 1)}>
                  <ChevLeft />
                </button>
                {getPagesArr().map((value, index) =>
                  value === "..." ? (
                    <button key={`dots-${index}`} className="pg-btn" disabled>...</button>
                  ) : (
                    <button
                      key={value}
                      className={`pg-btn${safeP === value ? " pg-active" : ""}`}
                      onClick={() => setPage(value)}
                    >
                      {value}
                    </button>
                  )
                )}
                <button className="pg-btn" disabled={safeP === totalPages} onClick={() => setPage((previous) => previous + 1)}>
                  <ChevRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {requestTab === "purchase" && (
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="ct">External Machine Purchases</div>
                <div className="cs">Fulfill approved purchase requests by adding new machines to the inventory.</div>
              </div>
              <button className="btn-export" onClick={handleExportPurchase}>
                <DownloadIcon /> Export
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine Type</th>
                  <th>Garment Requested</th>
                  <th>Approved By (Manager ID)</th>
                  <th>
                    Approval
                    <span className="th-sub">Date | Priority</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty">
                        <p className="empty-title">Loading approved requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : pagedPurchase.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty">
                        <ShoppingIcon />
                        <p className="empty-title">No purchase requests found</p>
                        <p className="empty-sub">{error || "No purchase requests have been approved yet."}</p>
                      </div>
                    </td>
                  </tr>
                ) : pagedPurchase.map((row) => (
                  <tr key={row.id}>
                    <td><span className="req-id prq-id">{row.requestCode}</span></td>
                    <td>{row.machineType}</td>
                    <td>{row.garment}</td>
                    <td><span className="mc-id">{row.approvedByManagerId}</span></td>
                    <td>
                      <div className="approval-date">{row.approvalDate}</div>
                      <div className="approval-cm">{row.approvalMeta}</div>
                    </td>
                    <td>
                      <button
                        className="btn-add-machine"
                        onClick={() => handleAddMachine(row.id)}
                      >
                        <PlusIcon /> Add Machine
                      </button>
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
                <button className="pg-btn" disabled={safePurchasePage === 1} onClick={() => setPurchasePage((previous) => previous - 1)}>
                  <ChevLeft />
                </button>
                {getPurchasePagesArr().map((value, index) =>
                  value === "..." ? (
                    <button key={`dots-${index}`} className="pg-btn" disabled>...</button>
                  ) : (
                    <button
                      key={value}
                      className={`pg-btn${safePurchasePage === value ? " pg-active" : ""}`}
                      onClick={() => setPurchasePage(value)}
                    >
                      {value}
                    </button>
                  )
                )}
                <button
                  className="pg-btn"
                  disabled={safePurchasePage === purchaseTotalPages}
                  onClick={() => setPurchasePage((previous) => previous + 1)}
                >
                  <ChevRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`toast toast-${toast.type}${toast.visible ? " visible" : ""}`}>{toast.msg}</div>
    </div>
  );
}
