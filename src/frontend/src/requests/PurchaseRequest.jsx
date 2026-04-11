import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import TableEmptyState from "../components/TableEmptyState";
import apiClient from "../services/api";
import "./PurchaseRequest.css";

function PurchaseRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get("q") || "";
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

  const filteredRequests = purchaseRequests.filter((row) => {
    const query = searchQ.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [row.requestCode, row.machineType, row.toGarmentId, row.priority, row.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

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
            <h2 className="purchase-request-card-title">Requests Sent for Purchasing Machines</h2>
            <p className="purchase-request-card-description">Review and process purchase requests for new machines.</p>
          </div>
          <button
            type="button"
            className="request-new-btn"
            onClick={() => navigate("/requests/new?type=purchase")}
          >
            New Purchase Request
          </button>
        </div>

        <div className="purchase-request-table-wrap">
          {loading ? (
            <TableEmptyState message="Loading purchase requests..." minHeight={260} />
          ) : filteredRequests.length === 0 ? (
            <TableEmptyState message={error || "No purchase requests found."} minHeight={260} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Machine Type</th>
                  <th>To (Garment ID)</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((row) => (
                  <tr key={row.id}>
                    <td>{row.requestCode}</td>
                    <td>{row.machineType}</td>
                    <td>{row.toGarmentId}</td>
                    <td>
                      <span className={`purchase-priority ${row.priority}`}>{row.priority}</span>
                    </td>
                    <td>
                      {row.status === "approved" && <span className="purchase-badge approved">Approved</span>}
                      {row.status === "declined" && <span className="purchase-badge declined">Declined</span>}
                      {row.status === "pending" && (
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="purchase-request-footer">
          <span>{`Showing ${filteredRequests.length} purchase request${filteredRequests.length === 1 ? "" : "s"}`}</span>
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
