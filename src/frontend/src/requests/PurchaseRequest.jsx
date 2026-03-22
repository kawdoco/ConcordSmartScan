import AppFooter from "../components/AppFooter";
import "./PurchaseRequest.css";

const purchaseRequests = [
  {
    requestId: "PUR-2024-112",
    machineType: "Automatic Stitching Machine",
    toGarmentId: "UNIT-D4-PROD",
    priority: "high",
    status: "pending"
  },
  {
    requestId: "PUR-2024-115",
    machineType: "Industrial Fabric Cutter",
    toGarmentId: "UNIT-A1-MAIN",
    priority: "medium",
    status: "approved"
  },
  {
    requestId: "PUR-2024-118",
    machineType: "Electronic Buttonholer",
    toGarmentId: "UNIT-C2-SMPL",
    priority: "low",
    status: "pending"
  },
  {
    requestId: "PUR-2024-121",
    machineType: "Overlock Machine",
    toGarmentId: "UNIT-B3-LINE",
    priority: "high",
    status: "approved"
  },
  {
    requestId: "PUR-2024-125",
    machineType: "Automatic Spreader",
    toGarmentId: "UNIT-E2-CUT",
    priority: "medium",
    status: "declined"
  },
  {
    requestId: "PUR-2024-128",
    machineType: "Heavy Duty Steam Iron",
    toGarmentId: "UNIT-F1-FIN",
    priority: "low",
    status: "approved"
  },
  {
    requestId: "PUR-2024-132",
    machineType: "Computerized Quilter",
    toGarmentId: "UNIT-D4-PROD",
    priority: "high",
    status: "declined"
  }
];

function PurchaseRequest() {
  return (
    <section className="purchase-request-page">
      <div className="purchase-request-card">
        <div className="purchase-request-card-header">
          <h2 className="purchase-request-card-title">Requests Sent for Purchasing Machines</h2>
        </div>

        <div className="purchase-request-table-wrap">
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
              {purchaseRequests.map((row) => (
                <tr key={row.requestId}>
                  <td>{row.requestId}</td>
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
                        <button type="button" className="purchase-btn approve">Approve</button>
                        <button type="button" className="purchase-btn decline">Decline</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="purchase-request-footer">
          <span>Showing 1 to 7 of 7 requests</span>
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
