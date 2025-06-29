import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const KidDashboard = () => {
  const [kid, setKid] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [kidToken, setKidToken] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("kidToken");
      const kidData = localStorage.getItem("kidData");
      
      if (!token || !kidData) {
        router.push("/kidsLogin");
        return;
      }
      
      setKidToken(token);
      setKid(JSON.parse(kidData));
      loadTasks(JSON.parse(kidData)._id, selectedDate, token);
    }
  }, [selectedDate]);

  const loadTasks = async (kidId, date, token) => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(
        `${apiUrl}/kids/${kidId}/tasks`,
        {
          params: { date: formattedDate },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskIndex) => {
    if (!kid || !kidToken) return;

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    setTasks(updatedTasks);

    try {
      const response = await axios.put(
        `${apiUrl}/kids/${kid._id}/tasks/${updatedTasks[taskIndex]._id}/completion`,
        { completed: updatedTasks[taskIndex].completed },
        {
          headers: { Authorization: `Bearer ${kidToken}` },
        }
      );

      // Update kid points
      if (response.data && response.data.totalPoints !== undefined) {
        setKid((prevKid) => ({ ...prevKid, points: response.data.totalPoints }));
        
        // Show confetti animation for task completion
        if (updatedTasks[taskIndex].completed) {
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3000);
          playSuccessSound();
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert on error
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
      setTasks(updatedTasks);
    }
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAAA=";
      audio.play();
    } catch (e) {
      console.log("Audio play failed:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kidToken");
    localStorage.removeItem("kidData");
    router.push("/kidsLogin");
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading your awesome tasks... 🌟</div>
        </div>
      </div>
    );
  }

  if (!kid) {
    return (
      <div style={styles.container}>
        <p>No kid data found. Please log in again.</p>
      </div>
    );
  }

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <div style={styles.container}>
      {confetti && <div style={styles.confetti}>🎉✨🌟⭐🎊</div>}
      
      {/* Header with kid info */}
      <div style={styles.header}>
        <div style={styles.avatarSection}>
          <div style={styles.avatarWrapper}>
            <img
              src={kid.selectedAvatar || "/images/default-avatar.png"}
              alt={`${kid.name}'s avatar`}
              style={styles.avatar}
            />
            <div style={styles.statusDot}></div>
          </div>
          <h1 style={styles.welcomeText}>Welcome back, {kid.name}! 🎈</h1>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statNumber}>{kid.points}</div>
            <div style={styles.statLabel}>Stars Earned</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statNumber}>{completedTasksCount}</div>
            <div style={styles.statLabel}>Tasks Done Today</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statNumber}>{totalTasksCount}</div>
            <div style={styles.statLabel}>Total Tasks</div>
          </div>
        </div>
      </div>

      {/* Date selector */}
      <div style={styles.dateSection}>
        <label style={styles.dateLabel}>📅 Choose a date:</label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
          style={styles.dateInput}
        />
      </div>

      {/* Tasks list */}
      <div style={styles.tasksSection}>
        <h2 style={styles.sectionTitle}>🎯 Your Tasks for Today</h2>
        
        {tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyEmoji}>🎪</div>
            <p style={styles.emptyText}>No tasks for this date!</p>
            <p style={styles.emptySubtext}>Take a break and have fun! 🎮</p>
          </div>
        ) : (
          <div style={styles.tasksList}>
            {tasks.map((task, index) => (
              <div key={index} style={styles.taskCard}>
                <div style={styles.taskImageContainer}>
                  <img
                    src={task.image}
                    alt="Task"
                    style={styles.taskImage}
                  />
                  {task.completed && (
                    <div style={styles.completedBadge}>✅</div>
                  )}
                </div>
                
                <div style={styles.taskContent}>
                  <h3 style={styles.taskDescription}>{task.description}</h3>
                  <button
                    onClick={() => handleToggleComplete(index)}
                    style={{
                      ...styles.toggleButton,
                      ...(task.completed ? styles.completedButton : styles.incompleteButton)
                    }}
                  >
                    {task.completed ? "🌟 Done! Awesome!" : "⭐ Mark as Done"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {totalTasksCount > 0 && (
        <div style={styles.progressSection}>
          <h3 style={styles.progressTitle}>🚀 Your Progress Today</h3>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(completedTasksCount / totalTasksCount) * 100}%`
              }}
            ></div>
          </div>
          <p style={styles.progressText}>
            {completedTasksCount} of {totalTasksCount} tasks completed! 
            {completedTasksCount === totalTasksCount && " 🎉 All done! You're amazing!"}
          </p>
        </div>
      )}

      {/* Logout button */}
      <div style={styles.logoutSection}>
        <button onClick={handleLogout} style={styles.logoutButton}>
          👋 Goodbye for now!
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    padding: "20px",
    fontFamily: "Comic Sans MS, Comic Sans, cursive",
    position: "relative",
    overflow: "hidden",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    textAlign: "center",
    color: "white",
  },
  loadingSpinner: {
    width: "60px",
    height: "60px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  confetti: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "4rem",
    animation: "confettiBounce 3s ease-out",
    zIndex: 1000,
    pointerEvents: "none",
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "25px",
    padding: "30px",
    marginBottom: "25px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  avatarWrapper: {
    position: "relative",
    animation: "pulse 2s infinite",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "4px solid #FFD700",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    objectFit: "cover",
  },
  statusDot: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    width: "20px",
    height: "20px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    border: "2px solid white",
  },
  welcomeText: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2d3748",
    margin: 0,
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  statCard: {
    backgroundColor: "rgba(102,126,234,0.1)",
    borderRadius: "15px",
    padding: "15px",
    textAlign: "center",
    border: "2px solid rgba(102,126,234,0.2)",
  },
  statIcon: {
    fontSize: "2rem",
    marginBottom: "5px",
  },
  statNumber: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#718096",
    fontWeight: "bold",
  },
  dateSection: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "25px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },
  dateLabel: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2d3748",
    marginRight: "15px",
  },
  dateInput: {
    padding: "12px 15px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "16px",
    fontFamily: "Comic Sans MS, Comic Sans, cursive",
    backgroundColor: "#f7fafc",
  },
  tasksSection: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: "20px",
    textAlign: "center",
  },
  tasksList: {
    display: "grid",
    gap: "15px",
  },
  taskCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f7fafc",
    borderRadius: "15px",
    padding: "15px",
    border: "2px solid #e2e8f0",
    transition: "all 0.3s ease",
    animation: "slideInUp 0.5s ease-out",
  },
  taskImageContainer: {
    position: "relative",
    marginRight: "15px",
  },
  taskImage: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    objectFit: "cover",
    border: "3px solid white",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  completedBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    fontSize: "1.2rem",
    animation: "bounce 1s infinite",
  },
  taskContent: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskDescription: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#2d3748",
    margin: 0,
  },
  toggleButton: {
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "Comic Sans MS, Comic Sans, cursive",
  },
  completedButton: {
    backgroundColor: "#48bb78",
    color: "white",
    boxShadow: "0 5px 15px rgba(72,187,120,0.4)",
  },
  incompleteButton: {
    backgroundColor: "#667eea",
    color: "white",
    boxShadow: "0 5px 15px rgba(102,126,234,0.4)",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#718096",
  },
  emptyEmoji: {
    fontSize: "4rem",
    marginBottom: "15px",
  },
  emptyText: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  emptySubtext: {
    fontSize: "1rem",
  },
  progressSection: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },
  progressTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: "15px",
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: "20px",
    backgroundColor: "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #48bb78 0%, #38a169 100%)",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },
  progressText: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#4a5568",
    fontWeight: "bold",
  },
  logoutSection: {
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#e53e3e",
    color: "white",
    padding: "15px 30px",
    borderRadius: "25px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Comic Sans MS, Comic Sans, cursive",
    boxShadow: "0 8px 25px rgba(229,62,62,0.4)",
    transition: "all 0.3s ease",
  },
};

export default KidDashboard;
