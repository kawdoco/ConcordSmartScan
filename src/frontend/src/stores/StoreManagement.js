import React from 'react';

const StoreManagement = () => {
  // Table Data
  const stores = [
    { id: 'ST-101', name: 'Colombo 03', latLong: '6.9271, 79.8612', phone: '+94 11 234 5678', address: 'No. 45, Galle Road, Colombo 03' },
    { id: 'ST-105', name: 'Peradeniya', latLong: '7.2906, 80.6337', phone: '+94 81 987 6543', address: 'Peradeniya Road, Kandy' },
    { id: 'ST-108', name: 'Galle', latLong: '6.0367, 80.2170', phone: '+94 91 555 1234', address: 'Industrial Zone, Galle' },
  ];

  return (
    <div className="container-wrapper">
      {/* CSS Styles Directly Inside the Component */}
      <style>{`
        .container-wrapper { display: flex; min-height: 100vh; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
        .sidebar { width: 250px; background: white; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; }
        .logo-area { padding: 25px; display: flex; align-items: center; gap: 10px; color: #1e40af; font-weight: bold; }
        .logo-sq { background: #1e40af; color: white; padding: 4px 8px; border-radius: 4px; }
        .nav-links { flex: 1; padding: 10px; }
        .nav-item { padding: 12px 15px; color: #64748b; cursor: pointer; border-radius: 6px; font-size: 14px; margin-bottom: 4px; }
        .nav-item.active { background: #2563eb; color: white; }
        .main-body { flex: 1; display: flex; flex-direction: column; }
        .top-nav { height: 60px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; }
        .search-box { width: 350px; padding: 8px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; }
        .content-inner { padding: 30px; }
        .table-card { background: white; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .card-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
        .add-btn { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; text-align: left; padding: 12px 20px; font-size: 11px; color: #94a3b8; border-bottom: 1px solid #e2e8f0; }
        td { padding: 14px 20px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .lat-long { font-family: monospace; color: #64748b; font-size: 12px; }
        .action-icons span { margin-right: 12px; cursor: pointer; opacity: 0.6; }
        .footer-bar { margin-top: auto; padding: 20px 30px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
      `}</style>

      {/* Sidebar Section */}
      <aside className="sidebar">
        <div className="logo-area">
          <span className="logo-sq">C</span>
          <div>Concord <div style={{fontSize: '9px', color:'#94a3b8'}}>APPAREL</div></div>
        </div>
        <nav className="nav-links">
          <div className="nav-item">Dashboard</div>
          <div className="nav-item">Users</div>
          <div className="nav-item">Machines</div>
          <div className="nav-item active">Stores</div>
          <div className="nav-item">Garments</div>
          <div className="nav-item">Approved Requests</div>
        </nav>
      </aside>

      {/* Main Content Section */}
      <main className="main-body">
        <header className="top-nav">
          <input type="text" className="search-box" placeholder="Search by Machine ID, Store ID..." />
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span>🔔</span>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '12px', fontWeight: 'bold'}}>Admin User</div>
              <div style={{fontSize: '10px', color: '#3b82f6'}}>system.admin@concord.com</div>
            </div>
          </div>
        </header>

        <div className="content-inner">
          <h2 style={{marginBottom: '20px', color: '#1e293b'}}>Store Management</h2>
          
          <div className="table-card">
            <div className="card-header">
              <div>
                <h3 style={{margin: 0, fontSize: '16px'}}>Registered Stores</h3>
                <p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>Manage all central and regional store locations.</p>
              </div>
              <button className="add-btn">+ Add New Store</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>STORE ID</th>
                  <th>BRANCH NAME</th>
                  <th>LOCATION (LAT, LONG)</th>
                  <th>PHONE NUMBER</th>
                  <th>ADDRESS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td style={{color: '#94a3b8'}}>{store.id}</td>
                    <td style={{fontWeight: 'bold'}}>{store.name}</td>
                    <td className="lat-long">{store.latLong}</td>
                    <td>{store.phone}</td>
                    <td>{store.address}</td>
                    <td className="action-icons">
                      <span>👁️</span> <span>✏️</span> <span>🗑️</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="footer-bar">
          <p>© 2024 Concord Apparel Pvt Ltd. Machine Replacement Locator System.</p>
          <div>
            <span style={{marginLeft: '15px'}}>Privacy Policy</span>
            <span style={{marginLeft: '15px'}}>System Manual</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default StoreManagement;