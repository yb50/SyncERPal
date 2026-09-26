import { useState } from "react";
import { getStockMovements, getStockMovementsForItem, createStockMovement, exportStockMovementsCsv } from "../api/stockMovementApi";

function useStockMovements(fetchItems) {
  const [stockMovements, setStockMovements] = useState([]);
  const [movementItemId, setMovementItemId] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementNote, setMovementNote] = useState("");
  const [movementFilterItemId, setMovementFilterItemId] = useState("");
  const [movementLocationId, setMovementLocationId] = useState("");

  function fetchStockMovements(token, itemId = movementFilterItemId) {
    if (!token) {
      setStockMovements([]);
      return Promise.resolve();
    }

    return getStockMovements(token, itemId).then((data) => {
        setStockMovements(data);
    });
  }

  function fetchStockMovementsForItem(itemId, token) {
    if (!token) {
      setStockMovements([]);
      return Promise.resolve();
    }

    return getStockMovementsForItem(itemId, token).then((data) => {
      setStockMovements(data);
    });
  }

  function changeMovementFilterItemId(itemId, token) {
    setMovementFilterItemId(itemId);

    return fetchStockMovements(token, itemId);
  }

  function saveStockMovement(token) {
    const stockMovement = {
      itemId: Number(movementItemId),
      locationId: Number(movementLocationId),
      type: movementType,
      quantity: Number(movementQuantity),
      note: movementNote,
    };

    return createStockMovement(stockMovement, token).then(() => {
      clearStockMovementForm();
      fetchItems(token);
      fetchStockMovements(token);
    });
  }

  function clearStockMovementForm() {
    setMovementItemId("");
    setMovementLocationId("");
    setMovementType("IN");
    setMovementQuantity("");
    setMovementNote("");
  }

  function exportStockMovements(token) {
    return exportStockMovementsCsv(token);
  }

  return {
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
    clearStockMovementForm,
    changeMovementFilterItemId,
    exportStockMovements,
  };
}

export default useStockMovements;