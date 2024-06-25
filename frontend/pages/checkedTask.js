import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Assuming you use axios for API calls

const CheckedTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [kid, setKid] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchKidData = async () => {
      setLoading(true);
      try {
        const selectedKid = JSON.parse(localStorage.getItem("selectedKid"));
        const token = localStorage.getItem("token");

        if (!selectedKid || !token) {
          throw new Error("Selected kid or token not found in localStorage");
        }

        const kidResponse = await axios.get(
          `http://localhost:5000/api/kids/${selectedKid.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setKid(kidResponse.data);

        fetchTasks(selectedKid.id, selectedDate);
      } catch (error) {
        console.error("Error fetching kid data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKidData();
  }, []);

  useEffect(() => {
    if (kid) {
      fetchTasks(kid.id, selectedDate);
    }
  }, [selectedDate]);

  const fetchTasks = async (kidId, date) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const taskResponse = await axios.get(
        `http://localhost:5000/api/tasks/${kidId}?date=${date.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      await axios.put(
        `http://localhost:5000/api/tasks/${updatedTasks[index]._id}`,
        { completed: updatedTasks[index].completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const kidResponse = await axios.get(
        `http://localhost:5000/api/kids/${kid.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setKid(kidResponse.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (index) => {
    const updatedTasks = [...tasks];
    const taskId = updatedTasks[index]._id;
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const kidResponse = await axios.get(
        `http://localhost:5000/api/kids/${kid.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setKid(kidResponse.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = () => {
    router.push("/insertTask");
  };

  const handleCompleteAllTasks = () => {
    router.push({
      pathname: "/completedTask",
      query: { kidName: kid.name },
    });
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

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Tasks for {kid.name}</h1>
        <img
          src={kid.avatar || "/images/default-avatar.png"}
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
          Completed
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
  },
  container: {
    textAlign: "center",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
  },
  starsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
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
  },
  taskImage: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
  },
  addTaskBtn: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  completeBtn: {
    padding: "10px 20px",
    backgroundColor: "green",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  changeKidBtn: {
    padding: "10px 20px",
    backgroundColor: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default CheckedTaskPage;
