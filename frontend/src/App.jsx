import { useEffect, useState } from "react";

import "./App.css";
import useItems from "./hooks/useItems";
import useStockMovements from "./hooks/useStockMovements";
import ItemSection from "./components/ItemSection";
import StockMovementSection from "./components/StockMovementSection";
import InventorySummary from "./components/InventorySummary";
import useAuditLogs from "./hooks/useAuditLogs";
import AuditLogTable from "./components/AuditLogTable";
import useUsers from "./hooks/useUsers";
import UserSection from "./components/UserSection";

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
    movementType,
    movementQuantity,
    movementNote,
    movementFilterItemId,
    setMovementItemId,
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
  } = useUsers();

  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
    fetchStockMovements();
    fetchAuditLogs();
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <h1>SyncERPal</h1>

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

      <StockMovementSection
        items={items}
        stockMovements={stockMovements}
        movementItemId={movementItemId}
        movementType={movementType}
        movementQuantity={movementQuantity}
        movementNote={movementNote}
        movementFilterItemId={movementFilterItemId}
        setMovementItemId={setMovementItemId}
        setMovementType={setMovementType}
        setMovementQuantity={setMovementQuantity}
        setMovementNote={setMovementNote}
        changeMovementFilterItemId={changeMovementFilterItemId}
        fetchAuditLogs={fetchAuditLogs}
        saveStockMovement={saveStockMovement}
        setError={setError}
        exportStockMovements={exportStockMovements}
      />

      <UserSection
        users={users}
        username={username}
        role={role}
        setUsername={setUsername}
        setRole={setRole}
        saveUser={saveUser}
        setError={setError}
      />

      <h2>Audit Logs</h2>

      <AuditLogTable auditLogs={auditLogs} />
    </div>
  );
}

export default App;