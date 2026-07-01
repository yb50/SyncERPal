import { useEffect, useState } from "react";

import "./App.css";
import useItems from "./hooks/useItems";
import useStockMovements from "./hooks/useStockMovements";
import ItemSection from "./components/ItemSection";
import StockMovementSection from "./components/StockMovementSection";
import InventorySummary from "./components/InventorySummary";

function App() {
  const {
    items,
    name,
    sku,
    quantity,
    lowStockThreshold,
    editingId,
    loading,
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

  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
    fetchStockMovements();
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
        setName={setName}
        setSku={setSku}
        setQuantity={setQuantity}
        setLowStockThreshold={setLowStockThreshold}
        saveItem={saveItem}
        removeItem={removeItem}
        startEditItem={startEditItem}
        clearItemForm={clearItemForm}
        fetchStockMovementsForItem={fetchStockMovementsForItem}
        setError={setError}
        exportItems={exportItems}
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
        saveStockMovement={saveStockMovement}
        setError={setError}
        exportStockMovements={exportStockMovements}
      />
    </div>
  );
}

export default App;