import { NavLink } from "react-router";

function AppHeader({ currentUser, onLogout }) {
  return (
    <header className="app-header">
      <div className="app-header-top">
        <h1 className="app-title">SyncERPal</h1>

        {currentUser && (
          <div className="app-header-user">
            <span>
              {currentUser.username} ({currentUser.role})
            </span>

            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {currentUser && (
        <nav className="section-nav app-header-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/items">Items</NavLink>
          <NavLink to="/locations">Locations</NavLink>
          <NavLink to="/stock-movements">Stock Movements</NavLink>
          <NavLink to="/stock-transfers">Stock Transfers</NavLink>
          <NavLink to="/inventory-balances">Inventory Balances</NavLink>

          {currentUser.role === "ADMIN" && (
            <NavLink to="/users">Users</NavLink>
          )}

          <NavLink to="/audit-logs">Audit Logs</NavLink>
        </nav>
      )}
    </header>
  );
}

export default AppHeader;