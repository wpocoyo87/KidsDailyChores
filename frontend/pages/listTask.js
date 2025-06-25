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
  const [noTasks, setNoTasks] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [selectedKidStr, setSelectedKidStr] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setSelectedKidStr(localStorage.getItem("selectedKid"));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let selectedKidStrValue = selectedKidStr;
        let tokenValue = token;
        if (typeof window !== "undefined") {
          selectedKidStrValue = localStorage.getItem("selectedKid");
          tokenValue = localStorage.getItem("token");
        }
        if (!selectedKidStrValue || !tokenValue) {
          console.error("Selected kid or token not found in localStorage");
          return;
        }
        const selectedKid = JSON.parse(selectedKidStrValue);
        if (!selectedKid._id) {
          console.error("Selected kid id is missing in localStorage");
          return;
        }
        const kidResponse = await axios.get(
          `${apiUrl}/kids/${selectedKid._id}`,
          {
            headers: {
              Authorization: `Bearer ${tokenValue}`,
            },
          }
        );
        setKid(kidResponse.data);
        await loadTasks(selectedKid._id, selectedDate, tokenValue);
      } catch (error) {
        console.error("Error fetching kid data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, selectedKidStr, token]);

  const loadTasks = async (kidId, date, tokenValue = token) => {
    setLoading(true);
    setNoTasks(false);
    if (!kidId) {
      console.error("Kid ID is missing or undefined");
      return;
    }
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const taskResponse = await axios.get(
        `${apiUrl}/kids/${kidId}/tasks`,
        {
          params: { date: formattedDate },
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );
      if (taskResponse.data.length === 0) {
        setNoTasks(true);
        setTasks([]);
      } else {
        setTasks(taskResponse.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNoTasks(true);
        setTasks([]);
      } else {
        console.error("Error fetching tasks:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    
    try {
      let tokenValue = token;
      if (typeof window !== "undefined") {
        tokenValue = localStorage.getItem("token");
      }
      if (!kid || !kid._id) {
        console.error("Kid ID is missing or undefined");
        return;
      }
      
      // Update task completion status - backend will automatically calculate points
      const response = await axios.put(
        `${apiUrl}/kids/${kid._id}/tasks/${updatedTasks[index]._id}/completion`,
        { completed: updatedTasks[index].completed },
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );
      
      // Update kid points from backend response
      if (response.data && response.data.totalPoints !== undefined) {
        setKid((prevKid) => ({ ...prevKid, points: response.data.totalPoints }));
        console.log(`Points updated to: ${response.data.totalPoints}`);
      }
      
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert the task completion status on error
      updatedTasks[index].completed = !updatedTasks[index].completed;
      setTasks(updatedTasks);
    }
  };

  const handleDeleteTask = async (index) => {
    const taskId = tasks[index]._id;
    try {
      let tokenValue = token;
      if (typeof window !== "undefined") {
        tokenValue = localStorage.getItem("token");
      }
      if (!kid || !kid._id) {
        console.error("Kid ID is missing or undefined");
        return;
      }
      await axios.delete(
        `${apiUrl}/kids/${kid._id}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
      const updatedPoints = await updateStarsForKid(kid._id, updatedTasks, tokenValue);
      setKid((prevKid) => ({ ...prevKid, points: updatedPoints }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = () => {
    router.push("/insert-task");
  };

  const handleCompleteAllTasks = async () => {
    if (!kid || !kid._id) {
      console.error("Kid ID is missing or undefined");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Complete all tasks - backend will automatically calculate total points
      const promises = tasks.map((task) =>
        axios.put(
          `${apiUrl}/kids/${kid._id}/tasks/${task._id}/completion`,
          { completed: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      const responses = await Promise.all(promises);
      
      // Get the final points from the last response (all should have same total)
      const lastResponse = responses[responses.length - 1];
      if (lastResponse.data && lastResponse.data.totalPoints !== undefined) {
        setKid((prevKid) => ({
          ...prevKid,
          points: lastResponse.data.totalPoints,
        }));
        console.log(`All tasks completed! Total points: ${lastResponse.data.totalPoints}`);
      }

      setTasks(tasks.map((task) => ({ ...task, completed: true })));
      router.push(`/completedTask?kidName=${kid.name}`);
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
          onError={(e) => {
            e.target.src = "/images/default-avatar.png";
          }}
        />
        <div style={styles.starsContainer}>
          <i className="fas fa-star" style={styles.starIcon}></i>
          <p style={styles.starsText}>Star Accumulated Point: {kid.points}</p>
        </div>
        <div style={styles.datePickerContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            style={styles.datePicker}
          />
        </div>
        {noTasks ? (
          <div>No tasks assigned for the selected date.</div>
        ) : (
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
        )}
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
    backgroundColor: "rgb(var(--background-start-rgb))",
    color: "rgb(var(--foreground-rgb))",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/images/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  container: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
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
  datePickerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  datePicker: {
    padding: "10px",
    border: "1px dashed orange", // Garis putus-putus oranye
    borderRadius: "8px", // Lebih melengkung
    backgroundColor: "#e3f2fd", // Warna biru muda
    color: "#0d47a1", // Warna biru
    textAlign: "center", // Menyelaraskan teks di tengah
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
    borderRadius: "8px", // Lebih melengkung
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
    borderRadius: "8px", // Lebih melengkung
    cursor: "pointer",
  },
  changeKidBtn: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    backgroundColor: "#ff9800", // Warna oranye
    color: "#fff",
    border: "none",
    borderRadius: "8px", // Lebih melengkung
    cursor: "pointer",
  },
};

export default ListTaskPage;
