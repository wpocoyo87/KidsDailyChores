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
  const [userRole, setUserRole] = useState(null); // 'kid' or 'parent'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user is a kid (kidToken exists) or parent (token exists)
      const kidToken = localStorage.getItem("kidToken");
      const parentToken = localStorage.getItem("token");

      if (kidToken) {
        // Kid is logged in
        setToken(kidToken);
        setUserRole("kid");
        const kidData = localStorage.getItem("kidData");
        if (kidData) {
          setSelectedKidStr(kidData);
        }
      } else if (parentToken) {
        // Parent is logged in
        setToken(parentToken);
        setUserRole("parent");
        setSelectedKidStr(localStorage.getItem("selectedKid"));
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let selectedKidStrValue = selectedKidStr;
        let tokenValue = token;

        if (typeof window !== "undefined") {
          // Check if user is a kid (kidToken exists) or parent (token exists)
          const kidToken = localStorage.getItem("kidToken");
          const parentToken = localStorage.getItem("token");

          if (kidToken) {
            // Kid is logged in
            tokenValue = kidToken;
            const kidData = localStorage.getItem("kidData");
            selectedKidStrValue = kidData;
          } else if (parentToken) {
            // Parent is logged in
            tokenValue = parentToken;
            selectedKidStrValue = localStorage.getItem("selectedKid");
          }
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
      const taskResponse = await axios.get(`${apiUrl}/kids/${kidId}/tasks`, {
        params: { date: formattedDate },
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      });

      // Handle the new API response format
      if (taskResponse.data.success) {
        const tasks = taskResponse.data.tasks || [];
        if (tasks.length === 0) {
          setNoTasks(true);
          setTasks([]);
        } else {
          setTasks(tasks);
        }
      } else {
        setNoTasks(true);
        setTasks([]);
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
    const newCompletedStatus = !(
      updatedTasks[index].completed || updatedTasks[index].isCompleted
    );
    updatedTasks[index].completed = newCompletedStatus;
    updatedTasks[index].isCompleted = newCompletedStatus;
    setTasks(updatedTasks);

    try {
      let tokenValue = token;
      if (typeof window !== "undefined") {
        // Check if user is a kid (kidToken exists) or parent (token exists)
        const kidToken = localStorage.getItem("kidToken");
        const parentToken = localStorage.getItem("token");

        if (kidToken) {
          tokenValue = kidToken;
        } else if (parentToken) {
          tokenValue = parentToken;
        }
      }

      if (!kid || !kid._id) {
        console.error("Kid ID is missing or undefined");
        return;
      }

      // Update task completion status - backend will automatically calculate points
      const response = await axios.put(
        `${apiUrl}/kids/${kid._id}/tasks/${updatedTasks[index]._id}/completion`,
        { completed: newCompletedStatus },
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );

      // Update kid points from backend response
      if (response.data && response.data.totalPoints !== undefined) {
        setKid((prevKid) => ({
          ...prevKid,
          points: response.data.totalPoints,
        }));
        console.log(`Points updated to: ${response.data.totalPoints}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert the task completion status on error
      updatedTasks[index].completed = !newCompletedStatus;
      updatedTasks[index].isCompleted = !newCompletedStatus;
      setTasks(updatedTasks);
    }
  };

  const handleDeleteTask = async (index) => {
    const taskId = tasks[index]._id;
    try {
      let tokenValue = token;
      if (typeof window !== "undefined") {
        // Check if user is a kid (kidToken exists) or parent (token exists)
        const kidToken = localStorage.getItem("kidToken");
        const parentToken = localStorage.getItem("token");

        if (kidToken) {
          tokenValue = kidToken;
        } else if (parentToken) {
          tokenValue = parentToken;
        }
      }

      if (!kid || !kid._id) {
        console.error("Kid ID is missing or undefined");
        return;
      }
      await axios.delete(`${apiUrl}/kids/${kid._id}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      });
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);

      // Reload tasks to get updated points from backend
      await loadTasks(kid._id, selectedDate, tokenValue);
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
      let tokenValue = token;
      if (typeof window !== "undefined") {
        // Check if user is a kid (kidToken exists) or parent (token exists)
        const kidToken = localStorage.getItem("kidToken");
        const parentToken = localStorage.getItem("token");

        if (kidToken) {
          tokenValue = kidToken;
        } else if (parentToken) {
          tokenValue = parentToken;
        }
      }

      // Complete all tasks - backend will automatically calculate total points
      const promises = tasks.map((task) =>
        axios.put(
          `${apiUrl}/kids/${kid._id}/tasks/${task._id}/completion`,
          { completed: true },
          {
            headers: {
              Authorization: `Bearer ${tokenValue}`,
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
        console.log(
          `All tasks completed! Total points: ${lastResponse.data.totalPoints}`
        );
      }

      setTasks(
        tasks.map((task) => ({ ...task, completed: true, isCompleted: true }))
      );
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
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Comic Sans MS",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.85)",
            padding: "50px 40px",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            minWidth: "320px",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
          <div
            style={{ fontSize: "1.5rem", color: "#2d3436", fontWeight: "bold" }}
          >
            Loading your tasks...
          </div>
        </div>
      </div>
    );
  }

  if (!kid) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Comic Sans MS",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.85)",
            padding: "50px 40px",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            minWidth: "320px",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>😕</div>
          <div
            style={{ fontSize: "1.5rem", color: "#2d3436", fontWeight: "bold" }}
          >
            No kid data found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Comic Sans MS",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "30px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          padding: "40px 30px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Header with avatar and name */}
        <div style={{ marginBottom: "20px" }}>
          <img
            src={kid.selectedAvatar || "/images/default-avatar.png"}
            alt={`Avatar of ${kid.name}`}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "4px solid #FFD700",
              boxShadow: "0 8px 25px rgba(255,215,0,0.18)",
              marginBottom: "10px",
              objectFit: "cover",
              background: "#fff",
            }}
            onError={(e) => {
              e.target.src = "/images/default-avatar.png";
            }}
          />
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "2rem",
              color: "#2d3748",
              margin: 0,
            }}
          >
            {userRole === "kid" ? `My Tasks! 📝` : `Tasks for ${kid.name}`}
          </h2>
        </div>
        {/* Star points badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "18px",
          }}
        >
          <span
            style={{
              background: "linear-gradient(90deg, #FFD700 60%, #fffbe6 100%)",
              color: "#b7791f",
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderRadius: "20px",
              padding: "8px 18px",
              boxShadow: "0 2px 8px rgba(255,215,0,0.12)",
              display: "inline-block",
            }}
          >
            {userRole === "kid"
              ? `⭐ My Stars: ${kid.points || kid.totalPoints || 0}`
              : `Star Accumulated Point: ${kid.points || kid.totalPoints || 0}`}
          </span>
        </div>
        {/* Date Picker */}
        <div style={{ marginBottom: "18px" }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            style={{
              padding: "12px",
              border: "2px dashed #667eea",
              borderRadius: "12px",
              background: "#f3f0ff",
              color: "#2d3748",
              fontWeight: "bold",
              fontSize: "1rem",
              width: "100%",
              textAlign: "center",
              fontFamily: "Comic Sans MS",
            }}
            calendarClassName="datePicker"
          />
        </div>
        {/* Task List */}
        {noTasks ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              fontSize: "1.2rem",
              color: "#7f8c8d",
              background: "rgba(255,255,255,0.7)",
              borderRadius: "18px",
              marginBottom: "18px",
            }}
          >
            {userRole === "kid"
              ? "🎉 Awesome! No tasks assigned for today!"
              : "No tasks assigned for the selected date."}
          </div>
        ) : (
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              marginBottom: "18px",
            }}
          >
            {tasks.map((task, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(102,126,234,0.08)",
                  borderRadius: "15px",
                  marginBottom: "12px",
                  padding: "12px",
                  boxShadow: "0 2px 8px rgba(102,126,234,0.08)",
                  border:
                    task.completed || task.isCompleted
                      ? "2px solid #48bb78"
                      : "2px solid #e2e8f0",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed || task.isCompleted || false}
                  onChange={() => handleToggleComplete(index)}
                  style={{ marginRight: "12px", width: "20px", height: "20px" }}
                />
                <img
                  src={task.image}
                  alt="Task"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    marginRight: "12px",
                    objectFit: "cover",
                    border: "2px solid #fff",
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontWeight: "bold",
                    color: "#2d3748",
                    fontSize: "1.05rem",
                    textAlign: "left",
                  }}
                >
                  {task.task || task.description}
                </span>
                {userRole === "parent" && (
                  <button
                    onClick={() => handleDeleteTask(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e53e3e",
                      fontSize: "1.3rem",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    🗑️
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {/* Action Buttons */}
        {userRole === "parent" && (
          <button
            onClick={handleAddTask}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "10px",
              background: "linear-gradient(90deg, #667eea 60%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "18px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              boxShadow: "0 8px 25px rgba(102,126,234,0.12)",
              cursor: "pointer",
              fontFamily: "Comic Sans MS",
              transition: "all 0.2s",
            }}
          >
            ➕ Add Task
          </button>
        )}
        <button
          onClick={handleCompleteAllTasks}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "10px",
            background: "linear-gradient(90deg, #48bb78 60%, #38a169 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "18px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 8px 25px rgba(72,187,120,0.12)",
            cursor: tasks.some((task) => !(task.completed || task.isCompleted))
              ? "pointer"
              : "not-allowed",
            opacity: tasks.some((task) => !(task.completed || task.isCompleted))
              ? 1
              : 0.5,
            fontFamily: "Comic Sans MS",
            transition: "all 0.2s",
          }}
          disabled={
            !tasks.some((task) => !(task.completed || task.isCompleted))
          }
        >
          {userRole === "kid" ? "🎉 Finish All Tasks!" : "Complete All"}
        </button>
        {userRole === "parent" && (
          <button
            onClick={handleKidChange}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "10px",
              background: "linear-gradient(90deg, #ff9800 60%, #ffd700 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "18px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              boxShadow: "0 8px 25px rgba(255,215,0,0.12)",
              cursor: "pointer",
              fontFamily: "Comic Sans MS",
              transition: "all 0.2s",
            }}
          >
            🔄 Change Kid
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Comic Sans MS !important",
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
    fontFamily: "Comic Sans MS !important",
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
    fontFamily: "Comic Sans MS !important",
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
    fontFamily: "Comic Sans MS !important",
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
    fontFamily: "Comic Sans MS !important",
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
    fontFamily: "Comic Sans MS !important",
    fontSize: "16px",
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
    fontFamily: "Comic Sans MS !important",
    fontSize: "16px",
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
    fontFamily: "Comic Sans MS !important",
    fontSize: "16px",
  },
};

export default ListTaskPage;
