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
          <NavLink 
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Dashboard
          </NavLink>

          <NavLink 
            to="/items"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Items
          </NavLink>

          <NavLink 
            to="/locations"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Locations
          </NavLink>

          <NavLink 
            to="/stock-movements"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Stock Movements
          </NavLink>

          <NavLink 
            to="/stock-transfers"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Stock Transfers
          </NavLink>

          <NavLink 
            to="/inventory-balances"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Inventory Balances
          </NavLink>

          {currentUser.role === "ADMIN" && (
            <NavLink 
              to="/users"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              Users
            </NavLink>
          )}

          <NavLink 
            to="/audit-logs"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Audit Logs
          </NavLink>
        </nav>
      )}
    </header>
  );
}

export default AppHeader;