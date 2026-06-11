import { useState } from "react";
import { getStockMovements, createStockMovement } from "../api/stockMovementApi";

function useStockMovements(fetchItems) {
  const [stockMovements, setStockMovements] = useState([]);
  const [movementItemId, setMovementItemId] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");

  function fetchStockMovements() {
    return getStockMovements().then((data) => {
      setStockMovements(data);
    });
  }

  function saveStockMovement() {
    const stockMovement = {
      itemId: Number(movementItemId),
      type: movementType,
      quantity: Number(movementQuantity),
      note: movementNote,
    };

    return createStockMovement(stockMovement).then(() => {
      clearStockMovementForm();
      fetchItems();
      fetchStockMovements();
    });
  }

  function clearStockMovementForm() {
    setMovementItemId("");
    setMovementType("IN");
    setMovementQuantity("");
    setMovementNote("");
  }

  return {
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
    clearStockMovementForm,
  };
}

export default useStockMovements;