import { useState } from "react";
import { createStockTransfer } from "../api/stockTransferApi";

function useStockTransfers() {
  const [transferItemId, setTransferItemId] = useState("");
  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [transferQuantity, setTransferQuantity] = useState("");
  const [transferNote, setTransferNote] = useState("");

  function clearStockTransferForm() {
    setTransferItemId("");
    setFromLocationId("");
    setToLocationId("");
    setTransferQuantity("");
    setTransferNote("");
  }

  function saveStockTransfer(performedBy) {
    const stockTransfer = {
      itemId: transferItemId === "" ? null : Number(transferItemId),
      fromLocationId: fromLocationId === "" ? null : Number(fromLocationId),
      toLocationId: toLocationId === "" ? null : Number(toLocationId),
      quantity: transferQuantity === "" ? null : Number(transferQuantity),
      note: transferNote,
    };

    return createStockTransfer(stockTransfer, performedBy).then(() => {
      clearStockTransferForm();
    });
  }

  return {
    transferItemId,
    fromLocationId,
    toLocationId,
    transferQuantity,
    transferNote,
    setTransferItemId,
    setFromLocationId,
    setToLocationId,
    setTransferQuantity,
    setTransferNote,
    saveStockTransfer,
  };
}

export default useStockTransfers;