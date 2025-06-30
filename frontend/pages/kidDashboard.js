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
  const [completingTask, setCompletingTask] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const emojis = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];

  useEffect(() => {
    // Check if kid is logged in
    const kidToken = localStorage.getItem('kidToken');
    const savedKidData = localStorage.getItem('kidData');
    
    console.log('Kid token exists:', !!kidToken);
    console.log('Saved kid data:', savedKidData);
    
    if (!kidToken || !savedKidData) {
      router.push('/kidsLogin');
      return;
    }

    try {
      const parsed = JSON.parse(savedKidData);
      console.log('Parsed kid data:', parsed);
      console.log('Kid ID:', parsed._id);
      
      if (!parsed._id) {
        console.error('Kid ID is missing from stored data');
        router.push('/kidsLogin');
        return;
      }
      
      setKidData(parsed);
      setPoints(parsed.totalPoints || 0);
      
      // Load tasks and refresh kid data
      loadKidTasks(parsed._id, kidToken);
      
      // Also fetch latest kid data to get updated points
      refreshKidData(parsed._id, kidToken);
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
  }, [router, emojis.length]);  const loadKidTasks = async (kidId, token) => {
    try {
      console.log('Loading tasks for kidId:', kidId);
      
      // Check if kidId is valid
      if (!kidId || kidId === 'undefined') {
        console.error('Invalid kidId for loading tasks:', kidId);
        return;
      }
      
      const response = await axios.get(`${apiUrl}/kids/${kidId}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Tasks response:', response.data);

      if (response.data.success) {
        setTasks(response.data.tasks || []);
        
        // Update points from response if available
        if (response.data.kid && response.data.kid.totalPoints !== undefined) {
          setPoints(response.data.kid.totalPoints);
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const refreshKidData = async (kidId, token) => {
    try {
      console.log('Refreshing kid data for:', kidId);
      
      // Check if kidId is valid
      if (!kidId || kidId === 'undefined') {
        console.error('Invalid kidId:', kidId);
        return;
      }
      
      const response = await axios.get(`${apiUrl}/kids/${kidId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Kid data response:', response.data);
      
      if (response.data && response.data.totalPoints !== undefined) {
        console.log('Setting points from kid data:', response.data.totalPoints);
        setPoints(response.data.totalPoints);
        
        // Update localStorage with latest data
        const updatedKidData = { ...kidData, totalPoints: response.data.totalPoints };
        setKidData(updatedKidData);
        localStorage.setItem('kidData', JSON.stringify(updatedKidData));
      }
    } catch (error) {
      console.error('Error refreshing kid data:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleTaskComplete = async (taskId) => {
    if (completingTask) return; // Prevent double clicks

    console.log('Completing task:', taskId);
    setCompletingTask(taskId);
    const kidToken = localStorage.getItem('kidToken');
    
    console.log('Kid token:', kidToken ? 'exists' : 'missing');
    console.log('Kid data:', kidData);
    console.log('API URL:', apiUrl);
    console.log('Full URL:', `${apiUrl}/kids/tasks/${taskId}/complete`);

    try {
      const response = await axios.patch(`${apiUrl}/kids/tasks/${taskId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${kidToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Task complete response:', response.data);

      if (response.data.success) {
        // Play success sound
        playSound("success");
        
        // Update task status
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId 
              ? { ...task, isCompleted: true, completed: true } 
              : task
          )
        );

        // Update points
        const updatedPoints = response.data.kid.totalPoints;
        console.log('Updated points from task completion:', updatedPoints);
        setPoints(updatedPoints);
        
        // Update localStorage
        const updatedKidData = { ...kidData, totalPoints: updatedPoints };
        setKidData(updatedKidData);
        localStorage.setItem('kidData', JSON.stringify(updatedKidData));

        // Show celebration
        showCelebration();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      playSound("error");
    } finally {
      setCompletingTask(null);
    }
  };

  const showCelebration = () => {
    // Create confetti effect
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.innerHTML = ['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.fontSize = '20px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = 'fall 3s linear forwards';
        document.body.appendChild(confetti);

        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 3000);
      }, i * 50);
    }
  };

  const playSound = (type) => {
    try {
      let frequency;
      switch (type) {
        case "success":
          frequency = 1200;
          break;
        case "error":
          frequency = 300;
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

  const handleLogout = () => {
    localStorage.removeItem('kidToken');
    localStorage.removeItem('kidData');
    localStorage.removeItem('kidId');
    localStorage.removeItem('kidName');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!kidData) {
    return null;
  }

  const pendingTasks = tasks.filter(task => !task.isCompleted && !task.completed);
  const completedTasks = tasks.filter(task => task.isCompleted || task.completed);

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes taskSlide {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.animatedBg}></div>
        
        <div style={styles.floatingStars}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.star,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            >
              ⭐
            </div>
          ))}
        </div>

        <div style={styles.dashboard}>
          {/* Header Section */}
          <div style={styles.header}>
            <div style={styles.welcomeSection}>
              <img
                src={kidData.selectedAvatar || "/images/default-avatar.png"}
                alt={kidData.name}
                style={styles.kidAvatar}
              />
              <div>
                <h1 style={styles.welcomeTitle}>
                  Hi {kidData.name}! 
                  <span style={styles.emojiAnimation}>
                    {emojis[currentEmoji]}
                  </span>
                </h1>
                <p style={styles.welcomeSubtitle}>Ready to complete some tasks today?</p>
              </div>
            </div>
            
            <button onClick={handleLogout} style={styles.logoutButton}>
              👋 Logout
            </button>
          </div>

          {/* Points Display */}
          <div style={styles.pointsCard}>
            <div style={styles.pointsIcon}>⭐</div>
            <div>
              <h2 style={styles.pointsTitle}>My Stars</h2>
              <p style={styles.pointsCount}>{points} stars collected!</p>
            </div>
          </div>

          {/* Tasks Section */}
          <div style={styles.tasksSection}>
            {/* Pending Tasks */}
            <div style={styles.taskColumn}>
              <h3 style={styles.sectionTitle}>
                📋 My Tasks ({pendingTasks.length})
              </h3>
              
              {pendingTasks.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🎉</div>
                  <p style={styles.emptyText}>
                    Awesome! You have completed all your tasks!
                  </p>
                </div>
              ) : (
                <div style={styles.tasksList}>
                  {pendingTasks.map((task, index) => (
                    <div 
                      key={task._id} 
                      style={{
                        ...styles.taskCard,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div style={styles.taskContent}>
                        <img
                          src={task.image || "/images/task1.png"}
                          alt={task.task}
                          style={styles.taskImage}
                        />
                        <div style={styles.taskInfo}>
                          <h4 style={styles.taskTitle}>{task.task}</h4>
                          <p style={styles.taskPoints}>⭐ +{task.points || 10} stars</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleTaskComplete(task._id)}
                        disabled={completingTask === task._id}
                        style={styles.completeButton}
                      >
                        {completingTask === task._id ? (
                          <span style={styles.spinner}></span>
                        ) : (
                          "✅ Done!"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div style={styles.taskColumn}>
                <h3 style={styles.sectionTitle}>
                  ✅ Completed ({completedTasks.length})
                </h3>
                
                <div style={styles.tasksList}>
                  {completedTasks.slice(0, 5).map((task, index) => (
                    <div 
                      key={task._id} 
                      style={{
                        ...styles.completedTaskCard,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div style={styles.taskContent}>
                        <img
                          src={task.image || "/images/task1.png"}
                          alt={task.task}
                          style={styles.completedTaskImage}
                        />
                        <div style={styles.taskInfo}>
                          <h4 style={styles.completedTaskTitle}>{task.task}</h4>
                          <p style={styles.completedTaskPoints}>⭐ +{task.points || 10} stars earned!</p>
                        </div>
                      </div>
                      
                      <div style={styles.completedBadge}>
                        ✅
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "Comic Sans MS",
    position: "relative",
    overflow: "hidden",
  },
  animatedBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef, #a8edea, #fed6e3)",
    backgroundSize: "400% 400%",
    animation: "gradientShift 15s ease infinite",
    zIndex: -1,
  },
  floatingStars: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  star: {
    position: "absolute",
    color: "rgba(255,255,255,0.8)",
    fontSize: "20px",
    animation: "float 6s ease-in-out infinite",
  },
  dashboard: {
    position: "relative",
    zIndex: 1,
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    animation: "slideInUp 0.6s ease-out",
  },
  welcomeSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  kidAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #ff6b6b",
    boxShadow: "0 5px 15px rgba(255, 107, 107, 0.3)",
  },
  welcomeTitle: {
    fontSize: "2.5rem",
    margin: "0",
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  },
  welcomeSubtitle: {
    fontSize: "1.2rem",
    margin: "5px 0 0 0",
    color: "#7f8c8d",
  },
  emojiAnimation: {
    display: "inline-block",
    animation: "bounce 2s infinite",
    marginLeft: "10px",
  },
  logoutButton: {
    padding: "12px 20px",
    borderRadius: "15px",
    border: "2px solid #e74c3c",
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#e74c3c",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Comic Sans MS",
    transition: "all 0.3s ease",
  },
  pointsCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    animation: "slideInUp 0.8s ease-out",
    border: "3px solid #ffd700",
  },
  pointsIcon: {
    fontSize: "3rem",
    animation: "pulse 2s infinite",
  },
  pointsTitle: {
    fontSize: "1.8rem",
    margin: "0",
    color: "#2d3436",
    fontWeight: "bold",
  },
  pointsCount: {
    fontSize: "1.2rem",
    margin: "5px 0 0 0",
    color: "#00b894",
    fontWeight: "bold",
  },
  tasksSection: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "30px",
  },
  taskColumn: {
    animation: "slideInUp 1s ease-out",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    margin: "0 0 20px 0",
    color: "#2d3436",
    fontWeight: "bold",
    textAlign: "center",
  },
  tasksList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  taskCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    animation: "taskSlide 0.6s ease-out",
    border: "2px solid transparent",
  },
  completedTaskCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(46, 213, 115, 0.1)",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
    animation: "taskSlide 0.6s ease-out",
    border: "2px solid #2ed573",
  },
  taskContent: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: 1,
  },
  taskImage: {
    width: "60px",
    height: "60px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "2px solid #ddd",
  },
  completedTaskImage: {
    width: "60px",
    height: "60px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "2px solid #2ed573",
    opacity: 0.8,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: "1.3rem",
    margin: "0 0 5px 0",
    color: "#2d3436",
    fontWeight: "bold",
  },
  completedTaskTitle: {
    fontSize: "1.3rem",
    margin: "0 0 5px 0",
    color: "#2d3436",
    fontWeight: "bold",
    textDecoration: "line-through",
    opacity: 0.8,
  },
  taskPoints: {
    fontSize: "1rem",
    margin: "0",
    color: "#f39c12",
    fontWeight: "bold",
  },
  completedTaskPoints: {
    fontSize: "1rem",
    margin: "0",
    color: "#2ed573",
    fontWeight: "bold",
  },
  completeButton: {
    padding: "12px 20px",
    borderRadius: "15px",
    border: "none",
    backgroundColor: "#00b894",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Comic Sans MS",
    transition: "all 0.3s ease",
    minWidth: "100px",
  },
  completedBadge: {
    fontSize: "2rem",
    color: "#2ed573",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px",
    animation: "bounce 2s infinite",
  },
  emptyText: {
    fontSize: "1.3rem",
    color: "#7f8c8d",
    margin: "0",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "Comic Sans MS",
    background: "linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef, #a8edea, #fed6e3)",
  },
  loadingSpinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #4ecdc4",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "1.5rem",
    color: "#2d3436",
    fontWeight: "bold",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  },
};

export default KidDashboard;
