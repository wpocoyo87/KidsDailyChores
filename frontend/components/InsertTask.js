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
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const styles = {
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
      fontFamily: "Comic Sans MS",
    },
    loadingEmoji: {
      fontSize: "3rem",
      display: "block",
      marginBottom: "10px",
      animation: "bounce 1s infinite",
    },
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      padding: "20px",
      fontFamily: "Comic Sans MS",
      position: "relative",
      overflow: "visible",
    },
    backgroundElements: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 1,
    },
    floatingElement: {
      position: "absolute",
      fontSize: "2rem",
      opacity: 0.1,
      animation: "float 6s ease-in-out infinite",
    },
    innerContainer: {
      maxWidth: "1280px",
      margin: "0 auto",
      position: "relative",
      zIndex: 10,
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
      animation: "pulse 2s infinite",
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      border: "5px solid #FFD700",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
      objectFit: "cover",
      transition: "all 0.3s ease",
    },
    statusDot: {
      position: "absolute",
      bottom: "5px",
      right: "5px",
      width: "30px",
      height: "30px",
      backgroundColor: "#10b981",
      borderRadius: "50%",
      border: "3px solid white",
      animation: "ping 2s infinite",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "white",
      marginBottom: "8px",
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
      animation: "rainbow 3s infinite",
    },
    subtitle: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "1.2rem",
      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      position: "relative",
      overflow: "visible",
    },
    rightColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    card: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      border: "3px solid rgba(255,215,0,0.3)",
      padding: "24px",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      animation: "slideInUp 0.6s ease-out",
      position: "relative",
      overflow: "visible",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    iconWrapper: {
      padding: "12px",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      animation: "wiggle 2s infinite",
    },
    cardTitle: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "#2d3748",
    },
    datePickerContainer: {
      width: "100%",
      position: "relative",
      zIndex: 1000,
    },
    datePicker: {
      width: "200px",
      padding: "10px 12px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
      fontFamily: "Comic Sans MS",
      position: "relative",
      zIndex: 1000,
      boxSizing: "border-box",
    },
    imageGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
      gap: "15px",
      maxHeight: "350px",
      overflowY: "auto",
      padding: "10px",
      borderRadius: "15px",
      backgroundColor: "rgba(248,250,252,0.5)",
    },
    imageItem: {
      width: "100%",
      height: "90px",
      objectFit: "cover",
      borderRadius: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "3px solid transparent",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    selectedImage: {
      border: "3px solid #FFD700",
      boxShadow: "0 0 20px rgba(255,215,0,0.5)",
      transform: "scale(1.1) rotate(2deg)",
      animation: "selectedPulse 1s infinite",
    },
    input: {
      width: "100%",
      padding: "15px 20px",
      border: "2px solid #e2e8f0",
      borderRadius: "15px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s ease",
      marginBottom: "20px",
      fontFamily: "Comic Sans MS",
    },
    addButton: {
      width: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "15px 30px",
      borderRadius: "25px",
      border: "none",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
      fontFamily: "Comic Sans MS",
    },
    saveButton: {
      width: "100%",
      background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
      color: "white",
      padding: "15px 30px",
      borderRadius: "25px",
      border: "none",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      boxShadow: "0 8px 25px rgba(72,187,120,0.4)",
      fontFamily: "Comic Sans MS",
    },
    outlineButton: {
      width: "100%",
      backgroundColor: "rgba(255,255,255,0.9)",
      border: "3px solid #667eea",
      color: "#667eea",
      padding: "15px 30px",
      borderRadius: "25px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      fontFamily: "Comic Sans MS",
    },
    tasksList: {
      maxHeight: "300px",
      overflowY: "auto",
      borderRadius: "15px",
    },
    taskItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px",
      backgroundColor: "rgba(248,250,252,0.8)",
      borderRadius: "15px",
      marginBottom: "10px",
      transition: "all 0.3s ease",
      border: "2px solid transparent",
      animation: "slideInRight 0.5s ease-out",
    },
    taskImage: {
      width: "60px",
      height: "60px",
      borderRadius: "12px",
      objectFit: "cover",
      border: "3px solid white",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    taskDetails: {
      flex: 1,
      minWidth: 0,
    },
    taskDescription: {
      fontWeight: "bold",
      fontSize: "16px",
      color: "#2d3748",
      marginBottom: "4px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    taskDate: {
      fontSize: "14px",
      color: "#718096",
    },
    deleteButton: {
      padding: "10px",
      color: "#e53e3e",
      backgroundColor: "rgba(254,226,226,0.8)",
      border: "2px solid #feb2b2",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "1.2rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#718096",
    },
    emptyEmoji: {
      fontSize: "4rem",
      marginBottom: "15px",
      opacity: 0.5,
      animation: "bounce 2s infinite",
    },
    badge: {
      backgroundColor: "#667eea",
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
      padding: "8px 15px",
      borderRadius: "20px",
      animation: "pulse 2s infinite",
    },
    successMessage: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(72,187,120,0.95)",
      color: "white",
      padding: "20px 40px",
      borderRadius: "20px",
      fontSize: "1.5rem",
      fontWeight: "bold",
      zIndex: 1000,
      animation: "successPop 0.5s ease-out",
      textAlign: "center",
      boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    },
    confetti: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 999,
    },
    confettiPiece: {
      position: "absolute",
      width: "10px",
      height: "10px",
      animation: "confettiFall 3s linear infinite",
    },
    errorMessage: {
      backgroundColor: "#fee2e2",
      border: "2px solid #f87171",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "20px",
      color: "#dc2626",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      animation: "shake 0.5s ease-in-out",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    errorIcon: {
      fontSize: "20px",
    },
  }

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

  // Sound effects
  const playSound = (type) => {
    try {
      let audio
      switch (type) {
        case "click":
          audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
          )
          break
        case "success":
          audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
          )
          break
        case "delete":
          audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
          )
          break
      }
      if (audio) {
        audio.volume = 0.3
        audio.play().catch((e) => console.log("Audio play failed:", e))
      }
    } catch (error) {
      console.log("Sound not available:", error)
    }
  }

  if (!isClient || !token || !selectedKid) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>
            <span style={styles.loadingEmoji}>🎮</span>
            <p>Loading your awesome task creator...</p>
          </div>
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
    if (selectedKid && description && image) {
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

      // Success animation
      setShowSuccess(true)
      setShowConfetti(true)
      playSound("success")

      setTimeout(() => {
        setShowSuccess(false)
        setShowConfetti(false)
      }, 2000)
    } else {
      // Shake animation for validation
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const handleSaveTasks = async () => {
    try {
      setError("")
      setIsLoading(true)
      
      if (!selectedKid) {
        setError("Please select a kid first before saving tasks.")
        return
      }
      if (!tasks.length) {
        setError("Please add at least one task before saving.")
        return
      }
      if (!token) {
        setError("You are not logged in. Please log in again.")
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
      playSound("success")
      router.push("/listTask")
    } catch (error) {
      console.error("Error saving tasks:", error)
      
      // Handle specific error cases
      let errorMsg = "Failed to save tasks. Please try again.";
      if (error.response?.status === 401) {
        errorMsg = "You are not authorized. Please log in again.";
      } else if (error.response?.status === 404) {
        errorMsg = "Kid not found. Please select a valid kid.";
      } else if (error.response?.status === 400) {
        errorMsg = "Invalid task data. Please check your entries.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      setError(errorMsg)
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
    playSound("delete")
  }

  const handleImageClick = (imgPath) => {
    setSelectedImage(imgPath)
    setImage(imgPath)
    playSound("click")
  }

  const handleHomeClick = () => {
    playSound("click")
    router.push("/choosekids")
  }

  const handleSeeCurrentTasks = () => {
    playSound("click")
    router.push("/listTask")
  }

  return (
    <div style={styles.container}>
      <style jsx global>{`
        /* React DatePicker Custom Styles */
        .react-datepicker-wrapper {
          width: 200px;
          max-width: 200px;
          position: relative;
          z-index: 1000 !important;
        }
        
        .react-datepicker__input-container {
          width: 100%;
          position: relative;
          z-index: 1000 !important;
        }
        
        .react-datepicker__input-container input {
          width: 100% !important;
          box-sizing: border-box;
        }
        
        .react-datepicker {
          font-family: "Comic Sans MS" !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 15px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
          z-index: 99999 !important;
          position: absolute !important;
        }
        
        .react-datepicker__header {
          background-color: #667eea !important;
          border-bottom: none !important;
          border-radius: 13px 13px 0 0 !important;
          padding-top: 10px !important;
        }
        
        .react-datepicker__current-month {
          color: white !important;
          font-weight: bold !important;
          font-size: 16px !important;
          font-family: "Comic Sans MS" !important;
        }
        
        .react-datepicker__day-name {
          color: white !important;
          font-weight: bold !important;
          font-family: "Comic Sans MS" !important;
        }
        
        .react-datepicker__day {
          font-family: "Comic Sans MS" !important;
          border-radius: 8px !important;
          margin: 2px !important;
        }
        
        .react-datepicker__day:hover {
          background-color: #667eea !important;
          color: white !important;
        }
        
        .react-datepicker__day--selected {
          background-color: #ff6b6b !important;
          color: white !important;
          font-weight: bold !important;
        }
        
        .react-datepicker__day--today {
          background-color: #ffd700 !important;
          color: #333 !important;
          font-weight: bold !important;
        }
        
        .react-datepicker__navigation {
          border: none !important;
          background: none !important;
        }
        
        .react-datepicker__navigation--previous {
          border-right-color: white !important;
        }
        
        .react-datepicker__navigation--next {
          border-left-color: white !important;
        }
        
        .react-datepicker__portal {
          z-index: 99999 !important;
        }
        
        .react-datepicker-popper {
          z-index: 99999 !important;
        }
        
        .datePicker {
          width: 100% !important;
          padding: 12px 16px !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 15px !important;
          fontSize: 16px !important;
          outline: none !important;
          transition: all 0.3s ease !important;
          font-family: "Comic Sans MS" !important;
          background-color: white !important;
          cursor: pointer !important;
        }
        
        .datePicker:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 15px rgba(102, 126, 234, 0.3) !important;
        }
      `}</style>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes rainbow {
          0% { color: #ff0000; }
          16% { color: #ff8000; }
          33% { color: #ffff00; }
          50% { color: #00ff00; }
          66% { color: #0080ff; }
          83% { color: #8000ff; }
          100% { color: #ff0000; }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes selectedPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.5); }
          50% { box-shadow: 0 0 30px rgba(255,215,0,0.8); }
        }
        
        @keyframes successPop {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .image-item:hover {
          transform: scale(1.1) rotate(3deg);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.2);
        }
        
        .task-item:hover {
          background-color: rgba(237,242,247,0.9);
          border-color: #667eea;
          transform: translateX(5px);
        }
        
        .delete-button:hover {
          background-color: #fed7d7;
          transform: scale(1.1);
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
        }
        
        input:focus, .datePicker:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
          transform: scale(1.02);
        }
        
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @media (min-width: 1024px) {
          .grid-container {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>

      {/* Background floating elements */}
      <div style={styles.backgroundElements}>
        <div style={{ ...styles.floatingElement, top: "10%", left: "10%", animationDelay: "0s" }}>🎨</div>
        <div style={{ ...styles.floatingElement, top: "20%", right: "15%", animationDelay: "1s" }}>⭐</div>
        <div style={{ ...styles.floatingElement, bottom: "30%", left: "5%", animationDelay: "2s" }}>🎯</div>
        <div style={{ ...styles.floatingElement, bottom: "20%", right: "10%", animationDelay: "3s" }}>🏆</div>
        <div style={{ ...styles.floatingElement, top: "50%", left: "3%", animationDelay: "4s" }}>🌟</div>
      </div>

      {/* Success message */}
      {showSuccess && <div style={styles.successMessage}>🎉 Awesome! Task added! 🎉</div>}

      {/* Confetti */}
      {showConfetti && (
        <div style={styles.confetti}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.confettiPiece,
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarWrapper}>
              <img src={selectedKid.selectedAvatar || "/placeholder.svg"} alt="Kid Avatar" style={styles.avatar} />
              <div style={styles.statusDot}></div>
            </div>
            <div>
              <h1 style={styles.title}>🎮 Task Creator for {selectedKid ? selectedKid.name : "Loading..."} 🎮</h1>
              <p style={styles.subtitle}>✨ Create amazing daily adventures! ✨</p>
            </div>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <div style={styles.gridContainer} className="grid-container">
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Date Picker Card */}
            <div style={styles.card} className="card">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#dbeafe" }}>📅</div>
                <h3 style={styles.cardTitle}>🗓️ Pick Your Adventure Day</h3>
              </div>
              <div style={styles.datePickerContainer}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="datePicker"
                  style={styles.datePicker}
                  withPortal
                  portalId="root-portal"
                />
              </div>
            </div>

            {/* Image Selection Card */}
            <div style={styles.card} className="card">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#f3e8ff" }}>🎨</div>
                <h3 style={styles.cardTitle}>🖼️ Choose Your Mission Icon</h3>
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
            <div
              style={{ ...styles.card, ...(isShaking ? { animation: "shake 0.5s ease-in-out" } : {}) }}
              className="card"
            >
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#dcfce7" }}>✏️</div>
                <h3 style={styles.cardTitle}>📝 Describe Your Mission</h3>
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
                placeholder="What awesome task will you do? 🚀"
                required
              />
              <button onClick={handleAddTask} style={styles.addButton} className="button">
                ➕ Add to My Adventure List!
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            {/* Tasks List Card */}
            <div style={styles.card} className="card">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: "#fed7aa" }}>📋</div>
                <h3 style={styles.cardTitle}>🏆 My Adventure List</h3>
                <span style={styles.badge}>{tasks.length}</span>
              </div>

              <div style={styles.tasksList}>
                {tasks.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyEmoji}>🎯</div>
                    <p style={{ fontSize: "16px", fontWeight: "bold" }}>Ready for your first mission?</p>
                    <p style={{ fontSize: "14px" }}>Add a task above to get started! 🚀</p>
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div key={index} style={styles.taskItem} className="task-item">
                      <img src={task.image || "/placeholder.svg"} alt="Task" style={styles.taskImage} />
                      <div style={styles.taskDetails}>
                        <p style={styles.taskDescription}>{task.description}</p>
                        <p style={styles.taskDate}>📅 {task.date}</p>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {tasks.length > 0 && (
                <button onClick={handleSaveTasks} style={styles.saveButton} className="button">
                  💾 Save My Epic Adventures!
                </button>
              )}

              <button onClick={handleSeeCurrentTasks} style={styles.outlineButton} className="button">
                📋 Check My Current Missions
              </button>

              <button onClick={handleHomeClick} style={styles.outlineButton} className="button">
                🏠 Back to Home Base
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsertTask
