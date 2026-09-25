import { useEffect, useState } from "react";

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
    fetchItems();
    fetchStockMovements();
    fetchAuditLogs();
    fetchUsers(authToken);
    fetchLocations();
    fetchInventoryBalances();
    fetchStockTransfers();
    fetchSetupStatus();
  }, [authToken]);

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

      <nav className="section-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#low-stock">Low Stock</a>
        <a href="#items">Items</a>
        <a href="#locations">Locations</a>
        <a href="#stock-movements">Stock Movements</a>
        <a href="#stock-transfers">Stock Transfers</a>
        <a href="#inventory-balances">Inventory Balances</a>
        <a href="#users">Users</a>
        <a href="#audit-logs">Audit Logs</a>
      </nav>

      <section id="dashboard">
        <InventorySummary
          items={items}
          locations={locations}
          inventoryBalances={inventoryBalances}
          stockMovements={stockMovements}
          stockTransfers={stockTransfers}
          users={users}
          auditLogs={auditLogs}
        />
      </section>

      <section id="low-stock">
        <LowStockSection
          items={items}
          exportLowStockItems={exportLowStockItems}
        />
      </section>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <section id="items">
        <ItemSection
          items={items}
          name={name}
          sku={sku}
          quantity={quantity}
          lowStockThreshold={lowStockThreshold}
          editingId={editingId}
          loading={loading}
          importFile={importFile}
          canManageItems={canManageItems}
          stockMovements={stockMovements}
          inventoryBalances={inventoryBalances}
          stockTransfers={stockTransfers}
          authToken={authToken}
          setName={setName}
          setSku={setSku}
          setQuantity={setQuantity}
          setLowStockThreshold={setLowStockThreshold}
          saveItem={saveItem}
          removeItem={removeItem}
          startEditItem={startEditItem}
          clearItemForm={clearItemForm}
          fetchStockMovementsForItem={fetchStockMovementsForItem}
          fetchAuditLogs={fetchAuditLogs}
          setError={setError}
          handleApiError={handleApiError}
          exportItems={exportItems}
          setImportFile={setImportFile}
          importItems={importItems}
          setSuccessMessage={setSuccessMessage}
        />
      </section>

      <section id="locations">
        <LocationSection
          locations={locations}
          locationCode={locationCode}
          locationName={locationName}
          stockMovements={stockMovements}
          inventoryBalances={inventoryBalances}
          stockTransfers={stockTransfers}
          editingLocationId={editingLocationId}
          setLocationCode={setLocationCode}
          setLocationName={setLocationName}
          saveLocation={saveLocation}
          startEditLocation={startEditLocation}
          clearLocationForm={clearLocationForm}
          canManageLocations={canManageLocations}
          fetchAuditLogs={fetchAuditLogs}
          setError={setError}
          handleApiError={handleApiError}
          removeLocation={removeLocation}
          setSuccessMessage={setSuccessMessage}
          authToken={authToken}
        />
      </section>

      <section id="stock-movements">
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
          canCreateStockMovements={canCreateStockMovements}
          setMovementItemId={setMovementItemId}
          setMovementLocationId={setMovementLocationId}
          setMovementType={setMovementType}
          setMovementQuantity={setMovementQuantity}
          setMovementNote={setMovementNote}
          changeMovementFilterItemId={changeMovementFilterItemId}
          fetchAuditLogs={fetchAuditLogs}
          saveStockMovement={saveStockMovement}
          setError={setError}
          handleApiError={handleApiError}
          exportStockMovements={exportStockMovements}
          fetchInventoryBalances={fetchInventoryBalances}
          setSuccessMessage={setSuccessMessage}
          authToken={authToken}
        />
      </section>

      <section id="stock-transfers">
        <StockTransferSection
          items={items}
          locations={locations}
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
          canTransferStock={canTransferStock}
          fetchItems={fetchItems}
          fetchInventoryBalances={fetchInventoryBalances}
          fetchAuditLogs={fetchAuditLogs}
          setError={setError}
          handleApiError={handleApiError}
          stockTransfers={stockTransfers}
          exportStockTransfers={exportStockTransfers}
          setSuccessMessage={setSuccessMessage}
          authToken={authToken}
        />
      </section>

      <section id="inventory-balances">
        <InventoryBalanceSection
          inventoryBalances={inventoryBalances}
          items={items}
          locations={locations}
          exportInventoryBalances={exportInventoryBalances}
        />
      </section>

      <section id="users">
        <UserSection
          users={users}
          username={username}
          role={role}
          setUsername={setUsername}
          setRole={setRole}
          saveUser={saveUser}
          currentUsername={currentUsername}
          canManageUsers={canManageUsers}
          fetchAuditLogs={fetchAuditLogs}
          setError={setError}
          handleApiError={handleApiError}
          changeUserRole={changeUserRole}
          removeUser={removeUser}
          setSuccessMessage={setSuccessMessage}
          password={password}
          setPassword={setPassword}
          authToken={authToken}
          setupRequired={setupRequired}
        />
      </section>

      <section id="audit-logs">
        <AuditLogSection
          auditLogs={auditLogs}
          exportAuditLogs={exportAuditLogs}
        />
      </section>
    </div>
  );
}

export default App;