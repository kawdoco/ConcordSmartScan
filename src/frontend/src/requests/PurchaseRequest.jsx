import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
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
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPurchaseRequests = async () => {
    try {
      setError("");
      const response = await apiClient.get("/requests", {
        params: { type: "purchase" }
      });
      const normalizedRows = Array.isArray(response.data)
        ? response.data.map((row) => ({
            ...row,
            status: String(row.status || "pending").toLowerCase(),
            priority: String(row.priority || "medium").toLowerCase()
          }))
        : [];
      setPurchaseRequests(normalizedRows);
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
    try {
      await apiClient.patch(`/requests/${requestId}/status`, { status });
      fetchPurchaseRequests();
    } catch {
      setError("Failed to update request status.");
    }
  };

  return (
    <section className="purchase-request-page">
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

        <div className="purchase-request-table-wrap">
          {loading ? (
            <TableEmptyState message="Loading purchase requests..." minHeight={260} />
          ) : purchaseRequests.length === 0 ? (
            <TableEmptyState message={error || "No purchase requests found."} minHeight={260} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine Type</th>
                  <th>To (Garment ID)</th>
                  <th>Priority</th>
                  <th>{canManageStatus ? "Actions" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {purchaseRequests.map((row) => {
                  const status = STATUS_LABELS[row.status] ? row.status : "pending";

                  return (
                    <tr key={row.id}>
                      <td>{row.requestCode}</td>
                      <td>{row.machineType}</td>
                      <td>{row.toGarmentId}</td>
                      <td>
                        <span className={`purchase-priority ${row.priority}`}>{row.priority}</span>
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
                              onClick={() => updateRequestStatus(row.id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="purchase-btn decline"
                              onClick={() => updateRequestStatus(row.id, "declined")}
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
