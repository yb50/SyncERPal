import { useEffect, useState } from "react";

import "./App.css";
import useItems from "./hooks/useItems";
import useStockMovements from "./hooks/useStockMovements";
import ItemSection from "./components/Item/ItemSection";
import StockMovementSection from "./components/StockMovement/StockMovementSection";
import InventorySummary from "./components/InventorySummary";
import useAuditLogs from "./hooks/useAuditLogs";
import AuditLogTable from "./components/AuditLogTable";
import useUsers from "./hooks/useUsers";
import UserSection from "./components/User/UserSection";
import useLocations from "./hooks/useLocations";
import LocationSection from "./components/Location/LocationSection";
import useInventoryBalances from "./hooks/useInventoryBalances";
import InventoryBalanceSection from "./components/InventoryBalance/InventoryBalanceSection";
import useStockTransfers from "./hooks/useStockTransfers";
import StockTransferSection from "./components/StockTransfer/StockTransferSection";

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

      <InventorySummary items={items} />

      {error && <p className="error">{error}</p>}

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
      />

      <LocationSection
        locations={locations}
        locationCode={locationCode}
        locationName={locationName}
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
      />

      <InventoryBalanceSection 
        inventoryBalances={inventoryBalances}
        items={items}
        locations={locations}
        exportInventoryBalances={exportInventoryBalances}
      />

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
      />

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
      />

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
        fetchAuditLogs={fetchAuditLogs}
        removeUser={removeUser}
      />

      <h2>Audit Logs</h2>

      <AuditLogTable auditLogs={auditLogs} />
    </div>
  );
}

export default App;