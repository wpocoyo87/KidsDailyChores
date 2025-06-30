import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const KidDashboard = () => {
  const router = useRouter();
  const [kidData, setKidData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEmoji, setCurrentEmoji] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const emojis = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];

  useEffect(() => {
    // Check if kid is logged in
    const kidToken = localStorage.getItem('kidToken');
    const savedKidData = localStorage.getItem('kidData');
    
    if (!kidToken || !savedKidData) {
      router.push('/kidsLogin');
      return;
    }

    try {
      const parsed = JSON.parse(savedKidData);
      setKidData(parsed);
      setPoints(parsed.totalPoints || 0);
    } catch (error) {
      console.error('Error parsing kid data:', error);
      router.push('/kidsLogin');
    }

    // Emoji rotation
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % emojis.length);
    }, 2000);

    setIsLoading(false);
    return () => clearInterval(interval);
  }, [router, emojis.length]);

  const handleLogout = () => {
    localStorage.removeItem('kidToken');
    localStorage.removeItem('kidData');
    localStorage.removeItem('kidId');
    localStorage.removeItem('kidName');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const playSound = (type) => {
    try {
      let frequency;
      switch (type) {
        case "success":
          frequency = 1200;
          break;
        case "click":
          frequency = 800;
          break;
        default:
          frequency = 600;
      }

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Audio not available:", error);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      padding: "20px",
      fontFamily: "Comic Sans MS",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    animatedBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)",
      backgroundSize: "600% 600%",
      animation: "gradientShift 15s ease infinite",
      zIndex: -1,
    },
    card: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: "25px",
      padding: "40px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "600px",
      textAlign: "center",
      position: "relative",
      zIndex: 1,
      animation: "slideInUp 1s ease-out",
      marginBottom: "20px",
    },
    title: {
      fontSize: "2.5rem",
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "10px",
      fontWeight: "bold",
      animation: "titleBounce 2s ease-in-out infinite",
    },
    welcomeText: {
      fontSize: "1.5rem",
      color: "#2d3436",
      marginBottom: "20px",
    },
    avatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      border: "5px solid #4ecdc4",
      boxShadow: "0 0 20px rgba(78, 205, 196, 0.5)",
      marginBottom: "20px",
      animation: "pulse 2s infinite",
    },
    pointsCard: {
      background: "linear-gradient(45deg, #ffd700, #ffed4e)",
      borderRadius: "20px",
      padding: "20px",
      margin: "20px 0",
      boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)",
    },
    pointsText: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#2d3436",
    },
    emojiDisplay: {
      fontSize: "3rem",
      display: "inline-block",
      animation: "bounce 2s infinite",
      marginLeft: "10px",
    },
    button: {
      padding: "15px 30px",
      borderRadius: "20px",
      border: "none",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      fontFamily: "Comic Sans MS",
      transition: "all 0.3s ease",
      margin: "10px",
    },
    logoutButton: {
      background: "linear-gradient(45deg, #ff6b6b, #ff5252)",
      color: "white",
      boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4)",
    },
    tasksButton: {
      background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
      color: "white",
      boxShadow: "0 8px 25px rgba(78, 205, 196, 0.4)",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.animatedBg}></div>
        <div style={styles.card}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes titleBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.animatedBg}></div>
        
        <div style={styles.card}>
          <h1 style={styles.title}>
            Kid Dashboard
            <span style={styles.emojiDisplay}>
              {emojis[currentEmoji]}
            </span>
          </h1>

          {kidData && (
            <>
              <img
                src={kidData.selectedAvatar || "/images/default-avatar.png"}
                alt={kidData.name}
                style={styles.avatar}
              />
              
              <div style={styles.welcomeText}>
                Welcome back, {kidData.name}! 👋
              </div>

              <div style={styles.pointsCard}>
                <div style={styles.pointsText}>
                  ⭐ {points} Points ⭐
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    playSound("click");
                    router.push("/listTask");
                  }}
                  style={{...styles.button, ...styles.tasksButton}}
                >
                  📝 View My Tasks
                </button>
                
                <button
                  onClick={() => {
                    playSound("click");
                    handleLogout();
                  }}
                  style={{...styles.button, ...styles.logoutButton}}
                >
                  🚪 Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default KidDashboard;
