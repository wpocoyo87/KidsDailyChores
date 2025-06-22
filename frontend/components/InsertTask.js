"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const InsertTask = () => {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [storedSelectedKid, setStoredSelectedKid] = useState(null)
  const [selectedKid, setSelectedKid] = useState(null)
  const [gender, setGender] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [tasks, setTasks] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true)
      const tokenValue = localStorage.getItem("token")
      const kidValue = localStorage.getItem("selectedKid")
      setToken(tokenValue)
      setStoredSelectedKid(kidValue)
      if (kidValue) {
        try {
          const parsedSelectedKid = JSON.parse(kidValue)
          setSelectedKid(parsedSelectedKid)
          const genderValue = parsedSelectedKid.gender === "female" ? "Girl" : "Boy"
          setGender(genderValue)
          console.log("Gender of kid:", parsedSelectedKid.gender)
        } catch (error) {
          console.error("Error parsing selectedKid from localStorage", error)
        }
      }
    }
  }, [])

  if (!isClient || !token || !selectedKid) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p style={{ color: "#6b7280", fontSize: "18px" }}>Loading...</p>
        </div>
      </div>
    )
  }

  const fetchImages = (gender) => {
    const images = []
    const numImages = 12
    for (let i = 1; i <= numImages; i++) {
      images.push(`/images/${gender}Task${i}.jpeg`)
    }
    console.log("Fetched images for gender:", gender, images)
    return images
  }

  const handleAddTask = () => {
    if (selectedKid) {
      const newTask = {
        kidId: selectedKid._id,
        description,
        image,
        date: selectedDate.toISOString().split("T")[0],
      }
      setTasks([...tasks, newTask])
      setDescription("")
      setImage("")
      setSelectedImage(null)
      setSelectedDate(new Date())
    }
  }

  const handleSaveTasks = async () => {
    try {
      if (!selectedKid) {
        console.error("No kid selected to save tasks for")
        return
      }
      if (!tasks.length) {
        console.error("No tasks to save")
        return
      }
      if (!token) {
        console.error("Token not found in localStorage")
        return
      }
      const tasksToSave = tasks.map((task) => ({
        description: task.description,
        image: task.image,
        date: task.date,
      }))
      const response = await axios.post(
        `${apiUrl}/kids/${selectedKid._id}/tasks`,
        { tasks: tasksToSave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("Tasks saved successfully:", response.data)
      router.push("/listTask")
    } catch (error) {
      console.error("Error saving tasks:", error)
      if (error.response) {
        console.error("Server responded with status:", error.response.status)
        console.error("Server response data:", error.response.data)
      }
    }
  }

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
  }

  const handleImageClick = (imgPath) => {
    setSelectedImage(imgPath)
    setImage(imgPath)
  }

  const handleHomeClick = () => {
    router.push("/choosekids")
  }

  const handleSeeCurrentTasks = () => {
    router.push("/listTask")
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)",
      padding: "32px 16px",
    },
    innerContainer: {
      maxWidth: "1280px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "32px",
    },
    avatarContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      marginBottom: "24px",
    },
    avatarWrapper: {
      position: "relative",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      border: "4px solid white",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      objectFit: "cover",
    },
    statusDot: {
      position: "absolute",
      bottom: "-4px",
      right: "-4px",
      width: "24px",
      height: "24px",
      backgroundColor: "#10b981",
      borderRadius: "50%",
      border: "2px solid white",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "16px",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "32px",
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    rightColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #f3f4f6",
      padding: "24px",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    iconWrapper: {
      padding: "8px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1f2937",
    },
    datePickerContainer: {
      width: "100%",
    },
    datePicker: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s",
      ":focus": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    },
    imageGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
      gap: "12px",
      maxHeight: "320px",
      overflowY: "auto",
      padding: "4px",
    },
    imageItem: {
      width: "100%",
      height: "80px",
      objectFit: "cover",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "2px solid transparent",
    },
    selectedImage: {
      border: "3px solid #3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
      transform: "scale(1.05)",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s",
      marginBottom: "16px",
    },
    addButton: {
      width: "100%",
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    saveButton: {
      width: "100%",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    outlineButton: {
      width: "100%",
      backgroundColor: "white",
      border: "2px solid #d1d5db",
      color: "#374151",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    tasksList: {
      maxHeight: "256px",
      overflowY: "auto",
    },
    taskItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
      marginBottom: "8px",
      transition: "all 0.2s",
    },
    taskImage: {
      width: "48px",
      height: "48px",
      borderRadius: "8px",
      objectFit: "cover",
      border: "2px solid white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    taskDetails: {
      flex: 1,
      minWidth: 0,
    },
    taskDescription: {
      fontWeight: "500",
      fontSize: "14px",
      color: "#1f2937",
      marginBottom: "2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    taskDate: {
      fontSize: "12px",
      color: "#6b7280",
    },
    deleteButton: {
      padding: "8px",
      color: "#ef4444",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    emptyState: {
      textAlign: "center",
      padding: "32px 16px",
      color: "#6b7280",
    },
    badge: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      fontSize: "14px",
      fontWeight: "500",
      padding: "4px 12px",
      borderRadius: "20px",
    },
  }

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .image-item:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .task-item:hover {
          background-color: #f3f4f6;
        }
        
        .delete-button:hover {
          background-color: #fef2f2;
        }
        
        input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        @media (min-width: 1024px) {
          .grid-container {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>

      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarWrapper}>
              <img src={selectedKid.selectedAvatar || "/placeholder.svg"} alt="Kid Avatar" style={styles.avatar} />
              <div style={styles.statusDot}></div>
            </div>
            <div>
              <h1 style={styles.title}>Insert Task for {selectedKid ? selectedKid.name : "Loading..."}</h1>
              <p style={styles.subtitle}>Create daily activities and chores</p>
            </div>
          </div>
        </div>

        <div style={styles.gridContainer} className="grid-container">
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Date Picker Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#dbeafe" }}>📅</div>
                <h3 style={styles.cardTitle}>Select Date</h3>
              </div>
              <div style={styles.datePickerContainer}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  style={styles.datePicker}
                />
              </div>
            </div>

            {/* Image Selection Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#f3e8ff" }}>🖼️</div>
                <h3 style={styles.cardTitle}>Choose Image</h3>
              </div>
              <div style={styles.imageGrid}>
                {selectedKid &&
                  fetchImages(gender).map((imgPath, index) => (
                    <img
                      key={index}
                      src={imgPath || "/placeholder.svg"}
                      alt={`Task ${index + 1}`}
                      style={{
                        ...styles.imageItem,
                        ...(selectedImage === imgPath ? styles.selectedImage : {}),
                      }}
                      className="image-item"
                      onClick={() => handleImageClick(imgPath)}
                    />
                  ))}
              </div>
            </div>

            {/* Task Description Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#dcfce7" }}>📝</div>
                <h3 style={styles.cardTitle}>Task Description</h3>
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
                placeholder="Enter task description..."
                required
              />
              <button onClick={handleAddTask} style={styles.addButton} className="button">
                ➕ Add Task
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            {/* Tasks List Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#fed7aa" }}>📋</div>
                <h3 style={styles.cardTitle}>Today's Tasks</h3>
                <span style={styles.badge}>{tasks.length}</span>
              </div>

              <div style={styles.tasksList}>
                {tasks.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.3 }}>📋</div>
                    <p style={{ fontSize: "14px" }}>No tasks added yet</p>
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div key={index} style={styles.taskItem} className="task-item">
                      <img src={task.image || "/placeholder.svg"} alt="Task" style={styles.taskImage} />
                      <div style={styles.taskDetails}>
                        <p style={styles.taskDescription}>{task.description}</p>
                        <p style={styles.taskDate}>{task.date}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(index)}
                        style={styles.deleteButton}
                        className="delete-button"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {tasks.length > 0 && (
                <button onClick={handleSaveTasks} style={styles.saveButton} className="button">
                  💾 Save All Tasks
                </button>
              )}

              <button onClick={handleSeeCurrentTasks} style={styles.outlineButton} className="button">
                📋 See Current Tasks
              </button>

              <button onClick={handleHomeClick} style={styles.outlineButton} className="button">
                🏠 HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsertTask
