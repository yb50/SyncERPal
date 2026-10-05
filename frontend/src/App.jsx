import { useEffect, useState } from "react";

import { NavLink, Navigate, Route, Routes } from "react-router";
import "./App.css";
import useItems from "./hooks/useItems";
import useStockMovements from "./hooks/useStockMovements";
import ItemSection from "./components/Item/ItemSection";
import StockMovementSection from "./components/StockMovement/StockMovementSection";
import InventorySummary from "./components/InventorySummary";
import useAuditLogs from "./hooks/useAuditLogs";
import AuditLogSection from "./components/AuditLog/AuditLogSection";
import useUsers from "./hooks/useUsers";
import UserSection from "./components/User/UserSection";
import useLocations from "./hooks/useLocations";
import LocationSection from "./components/Location/LocationSection";
import useInventoryBalances from "./hooks/useInventoryBalances";
import InventoryBalanceSection from "./components/InventoryBalance/InventoryBalanceSection";
import useStockTransfers from "./hooks/useStockTransfers";
import StockTransferSection from "./components/StockTransfer/StockTransferSection";
import LowStockSection from "./components/LowStock/LowStockSection";
import useAuth from "./hooks/useAuth";
import LoginSection from "./components/LoginSection";
import { isForbiddenError, isUnauthorizedError } from "./api/apiError";
import RecentActivitySidebar from "./components/RecentActivitySidebar";

function App() {
  const {
    items,
    name,
    sku,
    quantity,
    lowStockThreshold,
    editingId,
    loading,
    importFile,
    setName,
    setSku,
    setQuantity,
    setLowStockThreshold,
    fetchItems,
    saveItem,
    removeItem,
    startEditItem,
    clearItemForm,
    exportItems,
    setImportFile,
    importItems,
    exportLowStockItems,
  } = useItems();

  const {
    stockMovements,
    movementItemId,
    movementLocationId,
    movementType,
    movementQuantity,
    movementNote,
    movementFilterItemId,
    setMovementItemId,
    setMovementLocationId,
    setMovementType,
    setMovementQuantity,
    setMovementNote,
    fetchStockMovements,
    fetchStockMovementsForItem,
    saveStockMovement,
    changeMovementFilterItemId,
    exportStockMovements,
  } = useStockMovements(fetchItems);

  const { 
    auditLogs, 
    fetchAuditLogs, 
    exportAuditLogs,
  } = useAuditLogs();

  const {
    users,
    username,
    role,
    password,
    setUsername,
    setRole,
    fetchUsers,
    saveUser,
    changeUserRole,
    removeUser,
    setPassword,
    setupRequired,
    fetchSetupStatus,
  } = useUsers();

  const {
    locations,
    locationCode,
    locationName,
    editingLocationId,
    setLocationCode,
    setLocationName,
    fetchLocations,
    saveLocation,
    startEditLocation,
    clearLocationForm,
    removeLocation,
  } = useLocations();

  const {
    inventoryBalances,
    fetchInventoryBalances,
    exportInventoryBalances,
  } = useInventoryBalances();

  const {
    transferItemId,
    fromLocationId,
    toLocationId,
    transferQuantity,
    transferNote,
    stockTransfers,
    exportStockTransfers,
    setTransferItemId,
    setFromLocationId,
    setToLocationId,
    setTransferQuantity,
    setTransferNote,
    saveStockTransfer,
    fetchStockTransfers,
  } = useStockTransfers();

  const {
    loggedInUser,
    loginUsername,
    loginPassword,
    authLoading,
    setLoginUsername,
    setLoginPassword,
    login,
    logout,
  } = useAuth();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentUser = loggedInUser;
  const currentUsername = loggedInUser ? loggedInUser.username : "";
  const authToken = loggedInUser ? loggedInUser.token : "";

  const isLoggedIn = loggedInUser != null;
  const showSetup = !authToken && setupRequired && !isLoggedIn;
  const showErpApp = !authLoading && isLoggedIn;
  const showLoginRequired = !authLoading && !setupRequired && !isLoggedIn;

  const canManageItems = currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER";
  const canManageUsers = setupRequired || currentUser?.role === "ADMIN";
  const canManageLocations = canManageItems;
  const canCreateStockMovements = currentUser != null;
  const canTransferStock = currentUser != null;

  function handleApiError(error) {
    if (isUnauthorizedError(error)) {
      logout();

      setSuccessMessage("");
      setError("Your session has expired. Please log in again.");
      return;
    }

    if (isForbiddenError(error)) {
      setSuccessMessage("");
      setError("You do not have permission to perform this action.");
      return;
    }

    setSuccessMessage("");
    setError(error.message);
  }

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchSetupStatus().catch(handleApiError);

    if (!authToken) {
      fetchItems("");
      fetchLocations("");
      fetchStockMovements("");
      fetchStockTransfers("");
      fetchInventoryBalances("");
      fetchAuditLogs("");
      fetchUsers("");
      return;
    }

    const protectedDataRequests = [
      fetchItems(authToken),
      fetchLocations(authToken),
      fetchStockMovements(authToken),
      fetchStockTransfers(authToken),
      fetchInventoryBalances(authToken),
      fetchAuditLogs(authToken),
    ];

    if (loggedInUser?.role === "ADMIN") {
      protectedDataRequests.push(fetchUsers(authToken));
    } else {
      fetchUsers("");
    }

    Promise.all(protectedDataRequests).catch(handleApiError);
  }, [authLoading, authToken, loggedInUser?.role]);

  return (
    <div className="app">
      <h1>SyncERPal</h1>

      <LoginSection
        loggedInUser={loggedInUser}
        loginUsername={loginUsername}
        loginPassword={loginPassword}
        authLoading={authLoading}
        setLoginUsername={setLoginUsername}
        setLoginPassword={setLoginPassword}
        login={login}
        logout={logout}
        setError={setError}
        setSuccessMessage={setSuccessMessage}
      />

      {showLoginRequired && (
        <section>
          <h2>Login Required</h2>
          <p className="hint">
            Please login to view and manage ERP data.
          </p>
        </section>
      )}

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      
      {showErpApp && (
        <>
          <nav className="section-nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/items">Items</NavLink>
            <NavLink to="/locations">Locations</NavLink>
            <NavLink to="/stock-movements">Stock Movements</NavLink>
            <NavLink to="/stock-transfers">Stock Transfers</NavLink>
            <NavLink to="/inventory-balances">Inventory Balances</NavLink>

            {currentUser?.role === "ADMIN" && (
              <NavLink to="/users">Users</NavLink>
            )}

            <NavLink to="/audit-logs">Audit Logs</NavLink>
          </nav>

          <div className="app-shell">
            <main className="app-content">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Navigate to="/dashboard" replace 
                    />
                  } 
                />

                <Route
                  path="/dashboard"
                  element={
                    <InventorySummary
                      items={items}
                      locations={locations}
                      inventoryBalances={inventoryBalances}
                      stockMovements={stockMovements}
                      stockTransfers={stockTransfers}
                      users={users}
                      // auditLogs={auditLogs}
                    />
                  }
                />

                <Route
                  path="/items"
                  element={
                    <>
                      <LowStockSection
                        items={items}
                        exportLowStockItems={exportLowStockItems}
                        authToken={authToken}
                        setError={setError}
                        handleApiError={handleApiError}
                      />

                      <ItemSection
                        items={items}
                        stockMovements={stockMovements}
                        inventoryBalances={inventoryBalances}
                        stockTransfers={stockTransfers}
                        name={name}
                        sku={sku}
                        quantity={quantity}
                        lowStockThreshold={lowStockThreshold}
                        editingId={editingId}
                        loading={loading}
                        importFile={importFile}
                        setName={setName}
                        setSku={setSku}
                        setQuantity={setQuantity}
                        setLowStockThreshold={setLowStockThreshold}
                        setImportFile={setImportFile}
                        saveItem={saveItem}
                        removeItem={removeItem}
                        startEditItem={startEditItem}
                        clearItemForm={clearItemForm}
                        importItems={importItems}
                        exportItems={exportItems}
                        exportLowStockItems={exportLowStockItems}
                        fetchStockMovementsForItem={fetchStockMovementsForItem}
                        fetchAuditLogs={fetchAuditLogs}
                        authToken={authToken}
                        canManageItems={canManageItems}
                        setError={setError}
                        setSuccessMessage={setSuccessMessage}
                        handleApiError={handleApiError}
                      />
                    </>
                  }
                />

                <Route
                  path="/locations"
                  element={
                    <LocationSection
                      locations={locations}
                      stockMovements={stockMovements}
                      inventoryBalances={inventoryBalances}
                      stockTransfers={stockTransfers}
                      locationCode={locationCode}
                      locationName={locationName}
                      editingLocationId={editingLocationId}
                      setLocationCode={setLocationCode}
                      setLocationName={setLocationName}
                      saveLocation={saveLocation}
                      removeLocation={removeLocation}
                      startEditLocation={startEditLocation}
                      clearLocationForm={clearLocationForm}
                      fetchAuditLogs={fetchAuditLogs}
                      authToken={authToken}
                      canManageLocations={canManageLocations}
                      setError={setError}
                      setSuccessMessage={setSuccessMessage}
                      handleApiError={handleApiError}
                    />
                  }
                />

                <Route
                  path="/stock-movements"
                  element={
                    <StockMovementSection
                      items={items}
                      locations={locations}
                      stockMovements={stockMovements}
                      movementItemId={movementItemId}
                      movementLocationId={movementLocationId}
                      movementType={movementType}
                      movementQuantity={movementQuantity}
                      movementNote={movementNote}
                      movementFilterItemId={movementFilterItemId}
                      setMovementItemId={setMovementItemId}
                      setMovementLocationId={setMovementLocationId}
                      setMovementType={setMovementType}
                      setMovementQuantity={setMovementQuantity}
                      setMovementNote={setMovementNote}
                      changeMovementFilterItemId={changeMovementFilterItemId}
                      saveStockMovement={saveStockMovement}
                      exportStockMovements={exportStockMovements}
                      fetchInventoryBalances={fetchInventoryBalances}
                      fetchAuditLogs={fetchAuditLogs}
                      authToken={authToken}
                      canCreateStockMovements={canCreateStockMovements}
                      setError={setError}
                      setSuccessMessage={setSuccessMessage}
                      handleApiError={handleApiError}
                    />
                  }
                />

                <Route
                  path="/stock-transfers"
                  element={
                    <StockTransferSection
                      items={items}
                      locations={locations}
                      stockTransfers={stockTransfers}
                      transferItemId={transferItemId}
                      fromLocationId={fromLocationId}
                      toLocationId={toLocationId}
                      transferQuantity={transferQuantity}
                      transferNote={transferNote}
                      setTransferItemId={setTransferItemId}
                      setFromLocationId={setFromLocationId}
                      setToLocationId={setToLocationId}
                      setTransferQuantity={setTransferQuantity}
                      setTransferNote={setTransferNote}
                      saveStockTransfer={saveStockTransfer}
                      exportStockTransfers={exportStockTransfers}
                      fetchItems={fetchItems}
                      fetchInventoryBalances={fetchInventoryBalances}
                      fetchAuditLogs={fetchAuditLogs}
                      authToken={authToken}
                      canTransferStock={canTransferStock}
                      setError={setError}
                      setSuccessMessage={setSuccessMessage}
                      handleApiError={handleApiError}
                    />
                  }
                />

                <Route
                  path="/inventory-balances"
                  element={
                    <InventoryBalanceSection
                      items={items}
                      locations={locations}
                      inventoryBalances={inventoryBalances}
                      exportInventoryBalances={exportInventoryBalances}
                      authToken={authToken}
                      handleApiError={handleApiError}
                    />
                  }
                />

                {currentUser?.role === "ADMIN" && (
                  <Route
                    path="/users"
                    element={
                      <UserSection
                        users={users}
                        username={username}
                        role={role}
                        password={password}
                        setupRequired={setupRequired}
                        currentUsername={currentUsername}
                        setUsername={setUsername}
                        setRole={setRole}
                        setPassword={setPassword}
                        saveUser={saveUser}
                        changeUserRole={changeUserRole}
                        removeUser={removeUser}
                        fetchAuditLogs={fetchAuditLogs}
                        authToken={authToken}
                        canManageUsers={canManageUsers}
                        setError={setError}
                        setSuccessMessage={setSuccessMessage}
                        handleApiError={handleApiError}
                      />
                    }
                  />
                )}

                <Route
                  path="/audit-logs"
                  element={
                    <AuditLogSection
                      auditLogs={auditLogs}
                      exportAuditLogs={exportAuditLogs}
                      authToken={authToken}
                      handleApiError={handleApiError}
                    />
                  }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

            <RecentActivitySidebar auditLogs={auditLogs} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;