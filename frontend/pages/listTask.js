// frontend/pages/listTask.js

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const ListTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [kid, setKid] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selectedKidStr = localStorage.getItem("selectedKid");
        const token = localStorage.getItem("token");

        if (!selectedKidStr || !token) {
          console.error("Selected kid or token not found in localStorage");
          return;
        }

        const selectedKid = JSON.parse(selectedKidStr);

        if (!selectedKid._id) {
          console.error("Selected kid id is missing in localStorage");
          return;
        }

        // Fetch kid data from backend using kidRouter
        const kidResponse = await axios.get(
          `http://localhost:5000/api/kids/${selectedKid._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setKid(kidResponse.data);
        await loadTasks(selectedKid._id, selectedDate);
      } catch (error) {
        console.error("Error fetching kid data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const loadTasks = async (kidId, date) => {
    setLoading(true);
    try {
      // Fetch tasks using taskRouter
      const taskResponse = await axios.get(
        `http://localhost:5000/api/tasks/${kidId}/tasks`,
        {
          params: { date: date.toISOString() },
        }
      );
      setTasks(taskResponse.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);

    try {
      const token = localStorage.getItem("token");

      // Update task completion status using taskRouter
      await axios.put(
        `http://localhost:5000/api/tasks/${updatedTasks[index]._id}`,
        { completed: updatedTasks[index].completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update stars for the kid based on completed tasks
      const updatedKid = await updateStarsForKid(kid._id, updatedTasks);
      setKid(updatedKid);
    } catch (error) {
      console.error("Error updating task:", error);
      updatedTasks[index].completed = !updatedTasks[index].completed;
      setTasks(updatedTasks);
    }
  };

  const updateStarsForKid = async (kidId, updatedTasks) => {
    const completedTasks = updatedTasks.filter((task) => task.completed);
    const totalStars = completedTasks.length; // Assuming 1 star per completed task

    try {
      const token = localStorage.getItem("token");

      // Update stars for the kid using kidRouter
      const updatedKidResponse = await axios.put(
        `http://localhost:5000/api/kids/${kidId}`,
        { stars: totalStars },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return updatedKidResponse.data;
    } catch (error) {
      console.error("Error updating stars for kid:", error);
      return kid; // Return current kid state if update fails
    }
  };

  const handleDeleteTask = async (index) => {
    const taskId = tasks[index]._id;

    try {
      const token = localStorage.getItem("token");

      // Delete task using taskRouter
      await axios.delete(
        `http://localhost:5000/api/tasks/${kid._id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);

      // Update stars for the kid based on remaining completed tasks
      const updatedKid = await updateStarsForKid(kid._id, updatedTasks);
      setKid(updatedKid);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = () => {
    router.push("/insertTask");
  };

  const handleCompleteAllTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const promises = tasks.map((task) =>
        axios.put(
          `http://localhost:5000/api/tasks/${task._id}`,
          { completed: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      await Promise.all(promises);

      // Update stars for the kid based on completed tasks
      const updatedKidResponse = await axios.put(
        `http://localhost:5000/api/kids/${kid._id}`,
        { stars: tasks.length },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setKid(updatedKidResponse.data);
      setTasks(tasks.map((task) => ({ ...task, completed: true })));
    } catch (error) {
      console.error("Error completing all tasks:", error);
    }
  };

  const handleKidChange = () => {
    router.push("/choosekids");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!kid) {
    return <div>No kid data found.</div>;
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Tasks for {kid.name}</h1>
        <img
          src={kid.selectedAvatar || "/images/default-avatar.png"}
          alt={`Avatar of ${kid.name}`}
          style={styles.avatar}
        />
        <div style={styles.starsContainer}>
          <i className="fas fa-star" style={styles.starIcon}></i>
          <p style={styles.starsText}>Star Accumulated Point: {kid.stars}</p>
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          style={styles.datePicker}
        />
        <ul style={styles.taskList}>
          {tasks.map((task, index) => (
            <li key={index} style={styles.taskItem}>
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => handleToggleComplete(index)}
              />
              <img src={task.image} alt="Task" style={styles.taskImage} />
              {task.description}
              <button onClick={() => handleDeleteTask(index)}>🗑️</button>
            </li>
          ))}
        </ul>
        <button onClick={handleAddTask} style={styles.addTaskBtn}>
          Add Task
        </button>
        <button
          onClick={handleCompleteAllTasks}
          style={{
            ...styles.completeBtn,
            opacity: tasks.every((task) => task.completed) ? 1 : 0.5,
            cursor: tasks.every((task) => task.completed)
              ? "pointer"
              : "not-allowed",
          }}
          disabled={!tasks.every((task) => task.completed)}
        >
          Complete All
        </button>
        <button onClick={handleKidChange} style={styles.changeKidBtn}>
          Change Kid
        </button>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Comic Sans MS, cursive",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  starsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  starIcon: {
    fontSize: "2rem",
    color: "gold",
    marginRight: "10px",
  },
  starsText: {
    margin: 0,
    fontSize: "1.2rem",
  },
  datePicker: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  taskList: {
    listStyleType: "none",
    padding: "0",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  taskImage: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
  },
  addTaskBtn: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  completeBtn: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  changeKidBtn: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ListTaskPage;
