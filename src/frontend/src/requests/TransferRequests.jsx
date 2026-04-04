import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import TableEmptyState from "../components/TableEmptyState";
import apiClient from "../services/api";
import "./TransferRequests.css";

function TransferRequests() {
  const navigate = useNavigate();
  const [transferRequests, setTransferRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            status: String(row.status || "").toLowerCase()
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
    try {
      await apiClient.patch(`/requests/${requestId}/status`, { status });
      fetchTransferRequests();
    } catch {
      setError("Failed to update request status.");
    }
  };

  return (
    <section className="transfer-requests-page">
      <div className="transfer-requests-card">
        <div className="transfer-requests-card-header">
          <div>
            <h2 className="transfer-requests-card-title">Requests Sent for Transfering Mchines</h2>
            <p className="transfer-requests-card-description">Review and process transfer requests between stores and garment units.</p>
          </div>
          <button
            type="button"
            className="request-new-btn"
            onClick={() => navigate("/requests/new?type=transfer")}
          >
            New Transfer Request
          </button>
        </div>

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transferRequests.map((row) => (
                  <tr key={row.id}>
                    <td>{row.requestCode}</td>
                    <td>{row.machineId}</td>
                    <td>{row.fromStoreId ?? "null"}</td>
                    <td>{row.toGarmentId}</td>
                    <td>{row.reason}</td>
                    <td>
                      {row.status === "approved" && <span className="transfer-badge approved">Approved</span>}
                      {row.status === "declined" && <span className="transfer-badge declined">Declined</span>}
                      {row.status === "pending" && (
                        <div className="transfer-actions">
                          <button
                            type="button"
                            className="transfer-btn approve"
                            onClick={() => updateRequestStatus(row.id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="transfer-btn decline"
                            onClick={() => updateRequestStatus(row.id, "declined")}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="transfer-requests-footer">
          <span>{`Showing ${transferRequests.length} transfer request${transferRequests.length === 1 ? "" : "s"}`}</span>
          <div className="transfer-pagination">
            <button type="button" className="transfer-page-btn" disabled>
              <span aria-hidden="true">&lsaquo;</span>
            </button>
            <button type="button" className="transfer-page-btn active">1</button>
            <button type="button" className="transfer-page-btn" disabled>
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </div>
      </div>

      <AppFooter />
    </section>
  );
}

export default TransferRequests;
