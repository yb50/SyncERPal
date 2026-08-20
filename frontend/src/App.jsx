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
    setUsername,
    setRole,
    fetchUsers,
    saveUser,
    changeUserRole,
    removeUser,
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

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUsername, setCurrentUsername] = useState("system");

  const currentUser = users.find((user) => user.username === currentUsername);
  const canManageItems = currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER";
  const canManageUsers = users.length === 0 || currentUser?.role === "ADMIN";
  const canCreateStockMovements = currentUser != null;
  const canManageLocations = canManageItems;
  const canTransferStock = currentUser != null;

  useEffect(() => {
    fetchItems();
    fetchStockMovements();
    fetchAuditLogs();
    fetchUsers();
    fetchLocations();
    fetchInventoryBalances();
    fetchStockTransfers();
  }, []);

  return (
    <div className="app">
      <h1>SyncERPal</h1>

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

      <div>
        <label>Current user: </label>
        <select
          value={currentUsername}
          onChange={(event) => setCurrentUsername(event.target.value)}
        >
          <option value="system">system</option>

          {users.map((user) => (
            <option key={user.id} value={user.username}>
              {user.username} ({user.role})
            </option>
          ))}
        </select>

        <p>
          Current role: {currentUser ? currentUser.role : "No app user selected"}
        </p>
      </div>

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
          currentUsername={currentUsername}
          canManageItems={canManageItems}
          stockMovements={stockMovements}
          inventoryBalances={inventoryBalances}
          stockTransfers={stockTransfers}
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
          currentUsername={currentUsername}
          canManageLocations={canManageLocations}
          fetchAuditLogs={fetchAuditLogs}
          setError={setError}
          removeLocation={removeLocation}
          setSuccessMessage={setSuccessMessage}
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
          currentUsername={currentUsername}
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
          exportStockMovements={exportStockMovements}
          fetchInventoryBalances={fetchInventoryBalances}
          setSuccessMessage={setSuccessMessage}
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
          currentUsername={currentUsername}
          canTransferStock={canTransferStock}
          fetchItems={fetchItems}
          fetchInventoryBalances={fetchInventoryBalances}
          fetchAuditLogs={fetchAuditLogs}
          setError={setError}
          stockTransfers={stockTransfers}
          exportStockTransfers={exportStockTransfers}
          setSuccessMessage={setSuccessMessage}
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
          changeUserRole={changeUserRole}
          removeUser={removeUser}
          setSuccessMessage={setSuccessMessage}
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