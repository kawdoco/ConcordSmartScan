import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import ConfirmActionModal from "../components/ConfirmActionModal";
import TableEmptyState from "../components/TableEmptyState";
import { useAuth } from "../authentication/AuthContext";
import apiClient from "../services/api";
import "./PurchaseRequest.css";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined"
};

function PurchaseRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = String(user?.role || "").toUpperCase();
  const canManageStatus = role === "CHIEF_MANAGER";
  const showHistoryView = role === "TECHNICIAN";
  const [chiefManagerGarmentId, setChiefManagerGarmentId] = useState(null);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
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

  const extractNumericGarmentId = (value) => {
    const matched = String(value || "").match(/(\d+)/);
    if (!matched) {
      return null;
    }

    const parsed = Number(matched[1]);
    return Number.isInteger(parsed) ? parsed : null;
  };

  const fetchPurchaseRequests = async () => {
    try {
      setError("");
      const [response, currentUserResponse] = await Promise.all([
        apiClient.get("/requests", {
          params: { type: "purchase" }
        }),
        canManageStatus && user?.id ? apiClient.get(`/users/${user.id}`) : Promise.resolve(null)
      ]);

      const currentGarmentId = currentUserResponse?.data?.garmentId ?? null;
      setChiefManagerGarmentId(currentGarmentId);

      const normalizedRows = Array.isArray(response.data)
        ? response.data.map((row) => ({
            ...row,
            status: String(row.status || "pending").toLowerCase(),
            priority: String(row.priority || "medium").toLowerCase()
          }))
        : [];

      const visibleRows = canManageStatus
        ? (currentGarmentId != null
          ? normalizedRows.filter((row) => extractNumericGarmentId(row.toGarmentId) === Number(currentGarmentId))
          : [])
        : normalizedRows;

      setPurchaseRequests(visibleRows);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load purchase requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  const updateRequestStatus = async (requestId, status) => {
    const nextStatus = String(status || "").toLowerCase();

    setError("");
    setUpdatingRequestIds((previous) => (previous.includes(requestId) ? previous : [...previous, requestId]));

    try {
      await apiClient.patch(`/requests/${requestId}/status`, { status: nextStatus });
      await fetchPurchaseRequests();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update request status.");
    } finally {
      setUpdatingRequestIds((previous) => previous.filter((id) => id !== requestId));
    }
  };

  return (
    <section className="purchase-request-page">
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

      <div className="purchase-request-card">
        <div className="purchase-request-card-header">
          <div>
            <h2 className="purchase-request-card-title">
              {showHistoryView ? "Purchase History" : "Requests Sent for Purchasing Machines"}
            </h2>
            <p className="purchase-request-card-description">
              {showHistoryView
                ? "Track purchase requests and their current status."
                : "Review and process purchase requests for new machines."}
            </p>
          </div>
        </div>

        {error && <div className="request-inline-error">{error}</div>}

        <div className="purchase-request-table-wrap">
          {loading ? (
            <TableEmptyState message="Loading purchase requests..." minHeight={260} />
          ) : purchaseRequests.length === 0 ? (
            <TableEmptyState
              message={
                error
                  || (canManageStatus && chiefManagerGarmentId != null
                    ? "No purchase requests found for your garment."
                    : "No purchase requests found.")
              }
              minHeight={260}
            />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine Type</th>
                  <th>To (Garment ID)</th>
                  <th>Required Date</th>
                  <th>Reason</th>
                  <th>Priority</th>
                  <th>{canManageStatus ? "Actions" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {purchaseRequests.map((row) => {
                  const status = STATUS_LABELS[row.status] ? row.status : "pending";
                  const isUpdatingStatus = updatingRequestIds.includes(row.id);

                  return (
                    <tr key={row.id}>
                      <td>{row.requestCode}</td>
                      <td>{row.machineType}</td>
                      <td>{row.toGarmentId}</td>
                      <td>{row.requiredDate || "-"}</td>
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
                          <span className={`purchase-badge ${status}`}>{STATUS_LABELS[status]}</span>
                        )}
                        {canManageStatus && status !== "pending" && (
                          <span className={`purchase-badge ${status}`}>{STATUS_LABELS[status]}</span>
                        )}
                        {canManageStatus && status === "pending" && (
                          <div className="purchase-actions">
                            <button
                              type="button"
                              className="purchase-btn approve"
                              onClick={() => setPendingAction({
                                requestId: row.id,
                                requestCode: row.requestCode,
                                status: "approved"
                              })}
                              disabled={isUpdatingStatus}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="purchase-btn decline"
                              onClick={() => setPendingAction({
                                requestId: row.id,
                                requestCode: row.requestCode,
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

        <div className="purchase-request-footer">
          <span>{`Showing ${purchaseRequests.length} purchase request${purchaseRequests.length === 1 ? "" : "s"}`}</span>
          <div className="purchase-pagination">
            <button type="button" className="purchase-page-btn" disabled>
              <span aria-hidden="true">&lsaquo;</span>
            </button>
            <button type="button" className="purchase-page-btn active">1</button>
            <button type="button" className="purchase-page-btn" disabled>
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}

export default PurchaseRequest;
