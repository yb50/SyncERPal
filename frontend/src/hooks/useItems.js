import { useState } from "react";
import { getItems, createItem, updateItem, deleteItem, exportItemsCsv, importItemsCsv, exportLowStockItemsCsv } from "../api/itemApi";

function useItems() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);

function fetchItems(token) {
  if (!token) {
    setItems([]);
    return Promise.resolve();
  }

  setLoading(true);

  return getItems(token)
    .then((data) => {
      setItems(data);
    })
    .finally(() => {
      setLoading(false);
    });
}

  function saveItem(token) {
    const item = {
      name: name,
      sku: sku,
      quantity: 0,
      lowStockThreshold: Number(lowStockThreshold),
    };

    const request = 
      editingId === null
        ? createItem(item, token)
        : updateItem(editingId, item, token);

    return request.then(() => {
      clearItemForm();
      fetchItems(token);
    });
  }

  function removeItem(id, token) {
    return deleteItem(id, token).then(() => {
      fetchItems(token);
    });
  }

  function startEditItem(item) {
    setEditingId(item.id);
    setName(item.name);
    setSku(item.sku);
    setQuantity(item.quantity);
    setLowStockThreshold(item.lowStockThreshold);
  }

  function clearItemForm() {
    setEditingId(null);
    setName("");
    setSku("");
    setQuantity("");
    setLowStockThreshold("");
  }

  function exportItems(token) {
    return exportItemsCsv(token);
  }

  function importItems(token) {
    return importItemsCsv(importFile, token).then(() => {
      setImportFile(null);
      fetchItems(token);
    });
  }

  function exportLowStockItems(token) {
    return exportLowStockItemsCsv(token);
  }

  return {
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
  };
}

export default useItems;