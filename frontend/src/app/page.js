"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../services/checklistService";
import styles from "./page.module.css"; // Import your module styles

const Home = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading state

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const checklist = await getChecklist();
      setItems(checklist);
    } catch (error) {
      console.error("Error loading checklist:", error);
      // Handle error, e.g., show error message to user
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      // Prevent adding empty items
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const item = { item: newItem, completed: false };
      await addChecklistItem(item);

      // Optimistically update UI
      setItems((prevItems) => [...prevItems, item]);
      setNewItem(""); // Clear input field
    } catch (error) {
      console.error("Error adding checklist item:", error);
      // Handle error, e.g., show error message to user
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleToggleComplete = async (id, completed) => {
    await updateChecklistItem(id, { completed: !completed });
    loadItems();
  };

  const handleDeleteItem = async (id) => {
    await deleteChecklistItem(id);
    loadItems();
  };

  return (
    <main className={styles.main}>
      {" "}
      {/* Apply main style */}
      <h1>Daily Checklist for Kids</h1>
      <div className={styles.addItem}> {/* Apply addItem style */}</div>
      <ul className={styles.grid}>
        {" "}
        {/* Apply grid style */}
        {items.map((item) => (
          <li key={item._id} className={styles.card}>
            {" "}
            {/* Apply card style */}
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleComplete(item._id, item.completed)}
            />
            {item.item}
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteItem(item._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {/* Links styled with links class */}
      <div className={styles.links}>
        <Link href="/login">Login</Link>
        {" / "}
        <Link href="/register">Register</Link>
      </div>
    </main>
  );
};

export default Home;
