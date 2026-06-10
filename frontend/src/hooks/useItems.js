import { useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api/itemApi";

function useItems() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  function saveItem() {
    const item = {
      name: name,
      sku:sku,
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold),
    };

    const request = 
      editingId === null
        ? createItem(item)
        : updateItem(editingId, item);

    return request.then(() => {
      clearItemForm();
      fetchItems();
    });
  }

  function removeItem(id) {
    return deleteItem(id).then(() => {
      fetchItems();
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

  return {
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
  };
}

export default useItems;