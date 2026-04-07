import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import ConfirmActionModal from "../components/ConfirmActionModal";
import TableEmptyState from "../components/TableEmptyState";
import { useAuth } from "../authentication/AuthContext";
import apiClient from "../services/api";
import "./TransferRequests.css";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined"
};

function TransferRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canManageStatus = role === "CHIEF_MANAGER";
  const showHistoryView = role === "TECHNICIAN";
  const [transferRequests, setTransferRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingRequestIds, setUpdatingRequestIds] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);

  const truncateText = (text, maxLength = 20) => {
    const value = String(text || "").trim();
    if (value.length <= maxLength) {
      return value || "-";
    }
    return `${value.slice(0, maxLength)}...`;
  };

  const formatTransferRequestCode = (requestCode) => {
    const raw = String(requestCode || "").trim();
    if (!raw) {
      return "-";
    }

    const matched = raw.match(/^(?:TR|TRA)-(\d+)$/i);
    if (matched) {
      return `TRA-${String(Number(matched[1])).padStart(3, "0")}`;
    }

    return raw;
  };

  const fetchTransferRequests = async () => {
    try {
      setError("");
      const response = await apiClient.get("/requests", {
        params: { type: "transfer" }
      });
      const normalizedRows = Array.isArray(response.data)
        ? response.data.map((row) => ({
            ...row,
            fromStoreId: row.fromStoreId || null,
            priority: String(row.priority || "medium").toLowerCase(),
            status: String(row.status || "pending").toLowerCase()
          }))
        : [];
      setTransferRequests(normalizedRows);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load transfer requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferRequests();
  }, []);

  const updateRequestStatus = async (requestId, status) => {
    const nextStatus = String(status || "").toLowerCase();

    setError("");
    setUpdatingRequestIds((previous) => (previous.includes(requestId) ? previous : [...previous, requestId]));

    try {
      await apiClient.patch(`/requests/${requestId}/status`, { status: nextStatus });
      await fetchTransferRequests();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update request status.");
    } finally {
      setUpdatingRequestIds((previous) => previous.filter((id) => id !== requestId));
    }
  };

  return (
    <section className="transfer-requests-page">
      <ConfirmActionModal
        isOpen={Boolean(pendingAction)}
        title={pendingAction?.status === "approved" ? "Approve Request" : "Decline Request"}
        message={pendingAction?.status === "approved"
          ? `Are you sure you want to approve ${pendingAction?.requestCode || "this request"}?`
          : `Are you sure you want to decline ${pendingAction?.requestCode || "this request"}?`}
        confirmLabel={pendingAction?.status === "approved" ? "Approve" : "Decline"}
        variant={pendingAction?.status === "approved" ? "approve" : "decline"}
        isSubmitting={pendingAction ? updatingRequestIds.includes(pendingAction.requestId) : false}
        onCancel={() => setPendingAction(null)}
        onConfirm={async () => {
          if (!pendingAction) return;
          await updateRequestStatus(pendingAction.requestId, pendingAction.status);
          setPendingAction(null);
        }}
      />

      {selectedRequest && (
        <div className="request-note-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="request-note-title">
          <div className="request-note-modal">
            <h3 id="request-note-title">Additional Note</h3>
            <p className="request-note-label">Reason</p>
            <p className="request-note-body">{selectedRequest.reason || "-"}</p>
            <p className="request-note-label">Description</p>
            <p className="request-note-body">{selectedRequest.notes || "No additional note provided."}</p>
            <div className="request-note-actions">
              <button type="button" className="request-note-close" onClick={() => setSelectedRequest(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="transfer-requests-card">
        <div className="transfer-requests-card-header">
          <div>
            <h2 className="transfer-requests-card-title">
              {showHistoryView ? "Transfer History" : "Requests Sent for Transfering Mchines"}
            </h2>
            <p className="transfer-requests-card-description">
              {showHistoryView
                ? "Track the latest transfer requests and their current status."
                : "Review and process transfer requests between stores and garment units."}
            </p>
          </div>
        </div>

        {error && <div className="request-inline-error">{error}</div>}

        <div className="transfer-requests-table-wrap">
          {loading ? (
            <TableEmptyState message="Loading transfer requests..." minHeight={260} />
          ) : transferRequests.length === 0 ? (
            <TableEmptyState message={error || "No transfer requests found."} minHeight={260} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine ID</th>
                  <th>From (Store ID)</th>
                  <th>To (Garment ID)</th>
                  <th>Reason</th>
                  <th>Priority</th>
                  <th>{canManageStatus ? "Actions" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {transferRequests.map((row) => {
                  const status = STATUS_LABELS[row.status] ? row.status : "pending";
                  const isUpdatingStatus = updatingRequestIds.includes(row.id);

                  return (
                    <tr key={row.id}>
                      <td>{formatTransferRequestCode(row.requestCode)}</td>
                      <td>{row.machineId}</td>
                      <td>{row.fromStoreId ?? "null"}</td>
                      <td>{row.toGarmentId}</td>
                      <td>
                        <div className="request-reason-cell">
                          <span>{truncateText(row.reason)}</span>
                          <button
                            type="button"
                            className="request-see-more"
                            onClick={() => setSelectedRequest(row)}
                          >
                            See more
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`request-priority ${row.priority}`}>{row.priority}</span>
                      </td>
                      <td>
                        {!canManageStatus && (
                          <span className={`transfer-badge ${status}`}>{STATUS_LABELS[status]}</span>
                        )}
                        {canManageStatus && status !== "pending" && (
                          <span className={`transfer-badge ${status}`}>{STATUS_LABELS[status]}</span>
                        )}
                        {canManageStatus && status === "pending" && (
                          <div className="transfer-actions">
                            <button
                              type="button"
                              className="transfer-btn approve"
                              onClick={() => setPendingAction({
                                requestId: row.id,
                                requestCode: formatTransferRequestCode(row.requestCode),
                                status: "approved"
                              })}
                              disabled={isUpdatingStatus}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="transfer-btn decline"
                              onClick={() => setPendingAction({
                                requestId: row.id,
                                requestCode: formatTransferRequestCode(row.requestCode),
                                status: "declined"
                              })}
                              disabled={isUpdatingStatus}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="transfer-requests-footer">
          <span>{`Showing ${transferRequests.length} transfer request${transferRequests.length === 1 ? "" : "s"}`}</span>
          {canManageStatus && (
            <div className="transfer-pagination">
              <button type="button" className="transfer-page-btn" disabled>
                <span aria-hidden="true">&lsaquo;</span>
              </button>
              <button type="button" className="transfer-page-btn active">1</button>
              <button type="button" className="transfer-page-btn" disabled>
                <span aria-hidden="true">&rsaquo;</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AppFooter />
    </section>
  );
}

export default TransferRequests;
