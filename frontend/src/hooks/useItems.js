import { useState } from "react";
import { getItems, createItem, updateItem, deleteItem, exportItemsCsv, importItemsCsv } from "../api/itemApi";

function useItems() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);

  function fetchItems() {
    setLoading(true);

    return getItems()
      .then((data) => {
        setItems(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function saveItem(performedBy) {
    const item = {
      name: name,
      sku:sku,
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold),
    };

    const request = editingId === null
      ? createItem(item, performedBy)
      : updateItem(editingId, item, performedBy);

    return request.then(() => {
      clearItemForm();
      fetchItems();
    });
  }

  function removeItem(id, performedBy) {
    return deleteItem(id, performedBy).then(fetchItems);
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

  function exportItems() {
    exportItemsCsv();
  }

  function importItems() {
    if (importFile === null) {
      return Promise.reject(new Error("CSV file is required."));
    }

    return importItemsCsv(importFile).then(() => {
      setImportFile(null);
      fetchItems();
    });
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
  };
}

export default useItems;