import { useEffect, useState } from "react";

import "./App.css";
import useItems from "./hooks/useItems";
import useStockMovements from "./hooks/useStockMovements";
import ItemSection from "./components/ItemSection";
import StockMovementSection from "./components/StockMovementSection";

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
  } = useItems();

  const {
    stockMovements,
    movementItemId,
    movementType,
    movementQuantity,
    movementNote,
    setMovementItemId,
    setMovementType,
    setMovementQuantity,
    setMovementNote,
    fetchStockMovements,
    saveStockMovement,
  } = useStockMovements(fetchItems);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
    fetchStockMovements();
  }, []);

  return (
    <div className="app">
      <h1>SyncERPal</h1>

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
        setError={setError}
      />

      <StockMovementSection
        items={items}
        stockMovements={stockMovements}
        movementItemId={movementItemId}
        movementType={movementType}
        movementQuantity={movementQuantity}
        movementNote={movementNote}
        setMovementItemId={setMovementItemId}
        setMovementType={setMovementType}
        setMovementQuantity={setMovementQuantity}
        setMovementNote={setMovementNote}
        saveStockMovement={saveStockMovement}
        setError={setError}
      />
    </div>
  );
}

export default App;