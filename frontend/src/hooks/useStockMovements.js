import { useState } from "react";
import { getStockMovements, getStockMovementsForItem, createStockMovement } from "../api/stockMovementApi";

function useStockMovements(fetchItems) {
  const [stockMovements, setStockMovements] = useState([]);
  const [movementItemId, setMovementItemId] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");
  const [movementFilterItemId, setMovementFilterItemId] = useState("");

  function fetchStockMovements(itemId = movementFilterItemId) {
    return getStockMovements(itemId)
      .then((data) => {
        setStockMovements(data);
    });
  }

  function fetchStockMovementsForItem(itemId) {
    setMovementFilterItemId(String(itemId));

    return getStockMovementsForItem(itemId)
      .then((data) => {
        setStockMovements(data);
      });
  }

  function changeMovementFilterItemId(itemId) {
    setMovementFilterItemId(itemId);

    return fetchStockMovements(itemId);
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
    movementFilterItemId,
    setMovementItemId,
    setMovementType,
    setMovementQuantity,
    setMovementNote,
    fetchStockMovements,
    fetchStockMovementsForItem,
    saveStockMovement,
    clearStockMovementForm,
    changeMovementFilterItemId
  };
}

export default useStockMovements;