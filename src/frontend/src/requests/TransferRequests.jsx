import AppFooter from "../components/AppFooter";
import "./TransferRequests.css";

const transferRequests = [
  {
    requestId: "TR-2024-001",
    machineId: "MAC-JUKI-442",
    fromStoreId: "STORE-CENTRAL",
    toGarmentId: "UNIT-D4-PROD",
    reason: "Capacity Increase",
    status: "approved"
  },
  {
    requestId: "TR-2024-002",
    machineId: "MAC-CUT-901",
    fromStoreId: "STORE-NORTH",
    toGarmentId: "UNIT-A1-MAIN",
    reason: "Urgent Replacement",
    status: "pending"
  },
  {
    requestId: "TR-2024-003",
    machineId: "MAC-EMB-112",
    fromStoreId: "STORE-EAST",
    toGarmentId: "UNIT-C2-SMPL",
    reason: "New Sample Project",
    status: "approved"
  },
  {
    requestId: "TR-2024-004",
    machineId: "MAC-BT-005",
    fromStoreId: "STORE-SOUTH",
    toGarmentId: "UNIT-B3-PROD",
    reason: "Incorrect Specs",
    status: "declined"
  },
  {
    requestId: "TR-2024-005",
    machineId: "MAC-PRESS-08",
    fromStoreId: "STORE-WEST",
    toGarmentId: "UNIT-A1-MAIN",
    reason: "Workflow Optimization",
    status: "pending"
  },
  {
    requestId: "TR-2024-006",
    machineId: "MAC-JUKI-550",
    fromStoreId: "STORE-CENTRAL",
    toGarmentId: "UNIT-E5-EXP",
    reason: "Export Batch Demand",
    status: "approved"
  },
  {
    requestId: "TR-2024-007",
    machineId: "MAC-ZIP-101",
    fromStoreId: "STORE-NORTH",
    toGarmentId: "UNIT-D4-PROD",
    reason: "Unit at Capacity",
    status: "declined"
  }
];

function TransferRequests() {
  return (
    <section className="transfer-requests-page">
      <div className="transfer-requests-card">
        <div className="transfer-requests-card-header">
          <h2 className="transfer-requests-card-title">Requests Sent for Transfering Mchines</h2>
        </div>

        <div className="transfer-requests-table-wrap">
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
                <tr key={row.requestId}>
                  <td>{row.requestId}</td>
                  <td>{row.machineId}</td>
                  <td>{row.fromStoreId}</td>
                  <td>{row.toGarmentId}</td>
                  <td>{row.reason}</td>
                  <td>
                    {row.status === "approved" && <span className="transfer-badge approved">Approved</span>}
                    {row.status === "declined" && <span className="transfer-badge declined">Declined</span>}
                    {row.status === "pending" && (
                      <div className="transfer-actions">
                        <button type="button" className="transfer-btn approve">Approve</button>
                        <button type="button" className="transfer-btn decline">Decline</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="transfer-requests-footer">
          <span>Showing 1 to 7 of 7 requests</span>
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
