import { useState } from "react";
import { getStockTransfers, createStockTransfer } from "../api/stockTransferApi";

function useStockTransfers() {
  const [transferItemId, setTransferItemId] = useState("");
  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [transferQuantity, setTransferQuantity] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [stockTransfers, setStockTransfers] = useState([]);

  function clearStockTransferForm() {
    setTransferItemId("");
    setFromLocationId("");
    setToLocationId("");
    setTransferQuantity("");
    setTransferNote("");
  }

  function fetchStockTransfers() {
    return getStockTransfers().then((data) => {
      setStockTransfers(data);
    });
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
      fetchStockTransfers();
    });
  }

  return {
    transferItemId,
    fromLocationId,
    toLocationId,
    transferQuantity,
    transferNote,
    stockTransfers,
    setTransferItemId,
    setFromLocationId,
    setToLocationId,
    setTransferQuantity,
    setTransferNote,
    saveStockTransfer,
    fetchStockTransfers,
  };
}

export default useStockTransfers;