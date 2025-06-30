import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const KidProfilePage = () => {
  const router = useRouter();
  const [selectedKid, setSelectedKid] = useState(null);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [selectedKidData, setSelectedKidData] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fun characters for animation
  const characters = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];
  
  // Calculate age from birth date
  const calculateAge = (birthDate, existingAge) => {
    // If we have existing age in the database, use it as fallback
    if (!birthDate && existingAge !== undefined && existingAge !== null) {
      return existingAge;
    }
    
    if (!birthDate) return "Unknown";
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    // Check if the date is valid
    if (isNaN(birth.getTime())) {
      return existingAge || "Unknown";
    }
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    return date.toLocaleDateString('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Character rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [characters.length]);

  // Sound effects
  const playSound = (type) => {
    try {
      let frequency;
      switch (type) {
        case "click":
          frequency = 800;
          break;
        case "success":
          frequency = 1200;
          break;
        case "points":
          frequency = 1000;
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let tokenValue = token;
        let emailValue = email;
        let selectedKidValue = selectedKidData;
        if (typeof window !== "undefined") {
          tokenValue = localStorage.getItem("token");
          emailValue = localStorage.getItem("email");
          selectedKidValue = JSON.parse(localStorage.getItem("selectedKid"));
          setToken(tokenValue);
          setEmail(emailValue);
          setSelectedKidData(selectedKidValue);
        }
        const response = await axios.get(
          `${apiUrl}/users/profile/${emailValue}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenValue}`,
            },
          }
        );
        setUser(response.data);
        setSelectedKid(selectedKidValue);
        
        // Debug: Log the selected kid data to see what fields are available
        console.log("Selected Kid Data:", selectedKidValue);
        console.log("Birth Date:", selectedKidValue?.birthDate);
        console.log("Age field:", selectedKidValue?.age);
        console.log("All fields:", Object.keys(selectedKidValue || {}));
        
        // Fetch the accumulated points for the selected kid
        const pointsResponse = await axios.get(
          `${apiUrl}/kids/${selectedKidValue._id}/points`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenValue}`,
            },
          }
        );
        setPoints(pointsResponse.data.points);
        document.title = `Kid Profile`; // Set the document title
        setIsLoading(false);
        playSound("success");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
        // Handle error, e.g., redirect to login page or show error message
      }
    };
    fetchUserData();
  }, []); // Fetch user data only once when the component mounts

  const handleLogout = () => {
    playSound("click");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("selectedKid");
    }
    router.push("/");
  };

  const handleButtonClick = (action) => {
    playSound("click");
    // Additional actions can be added here based on the button clicked
  };

  if (!selectedKid || isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading Super Kid Profile... 🚀</p>
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes avatarGlow {
          0% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.6); }
          50% { box-shadow: 0 0 40px rgba(78, 205, 196, 0.8); }
          100% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.6); }
        }
        
        @keyframes pointsPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes buttonHover {
          0% { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .button-hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
        }
        
        .stat-card-hover {
          transform: scale(1.05) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
        }
        
        /* Remove underlines from all links */
        a {
          text-decoration: none !important;
        }
        
        /* Ensure buttons inside links don't have underlines */
        a button {
          text-decoration: none !important;
        }
      `}</style>
      
      <div style={styles.body}>
        {/* Animated Background */}
        <div style={styles.animatedBg}></div>
        
        {/* Floating Elements */}
        <div style={styles.floatingElements}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.floatingElement,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            >
              {['⭐', '🎈', '🌟', '✨', '🎯'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div style={styles.container}>
          {/* Header Section */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              {selectedKid.name}&apos;s Super Profile! 
              <span style={styles.characterDisplay}>
                {characters[currentCharacter]}
              </span>
            </h1>
            <div style={styles.subtitle}>
              Welcome back, superstar! 🌟
            </div>
          </div>

          {/* Avatar Section */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarContainer}>
              <img
                src={selectedKid.selectedAvatar || "/images/default-avatar.png"}
                alt={`Avatar of ${selectedKid.name}`}
                style={styles.avatar}
              />
              <div style={styles.avatarBadge}>
                {selectedKid.gender === 'boy' ? '👦' : '👧'}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={styles.statsContainer}>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => e.currentTarget.classList.add('stat-card-hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('stat-card-hover')}
            >
              <div style={styles.statIcon}>🎂</div>
              <div style={styles.statLabel}>Age</div>
              <div style={styles.statValue}>
                {(() => {
                  const calculatedAge = calculateAge(selectedKid.birthDate, selectedKid.age);
                  return calculatedAge === "Unknown" ? "Unknown" : `${calculatedAge} years old`;
                })()}
              </div>
            </div>
            
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => e.currentTarget.classList.add('stat-card-hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('stat-card-hover')}
            >
              <div style={styles.statIcon}>📅</div>
              <div style={styles.statLabel}>Birthday</div>
              <div style={styles.statValue}>
                {formatDate(selectedKid.birthDate)}
              </div>
            </div>
            
            <div 
              style={{...styles.statCard, ...styles.pointsCard}}
              onMouseEnter={(e) => e.currentTarget.classList.add('stat-card-hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('stat-card-hover')}
              onClick={() => playSound("points")}
            >
              <div style={styles.statIcon}>⭐</div>
              <div style={styles.statLabel}>Stars Earned</div>
              <div style={{...styles.statValue, ...styles.pointsValue}}>{points}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGrid}>
            <Link href="/insert-task" style={{textDecoration: "none"}}>
              <button 
                style={{...styles.actionButton, ...styles.insertTaskBtn}}
                onMouseEnter={(e) => e.target.classList.add('button-hover')}
                onMouseLeave={(e) => e.target.classList.remove('button-hover')}
                onClick={() => handleButtonClick('insert-task')}
              >
                <span style={styles.buttonIcon}>➕</span>
                <span>Add New Task</span>
              </button>
            </Link>
            
            <Link href="/listTask" style={{textDecoration: "none"}}>
              <button 
                style={{...styles.actionButton, ...styles.checkTaskBtn}}
                onMouseEnter={(e) => e.target.classList.add('button-hover')}
                onMouseLeave={(e) => e.target.classList.remove('button-hover')}
                onClick={() => handleButtonClick('list-task')}
              >
                <span style={styles.buttonIcon}>📋</span>
                <span>Check Tasks</span>
              </button>
            </Link>
            
            <Link href="/choosekids" style={{textDecoration: "none"}}>
              <button 
                style={{...styles.actionButton, ...styles.changeKidBtn}}
                onMouseEnter={(e) => e.target.classList.add('button-hover')}
                onMouseLeave={(e) => e.target.classList.remove('button-hover')}
                onClick={() => handleButtonClick('change-kid')}
              >
                <span style={styles.buttonIcon}>🔄</span>
                <span>Switch Kid</span>
              </button>
            </Link>
            
            <button 
              style={{...styles.actionButton, ...styles.logoutBtn}}
              onMouseEnter={(e) => e.target.classList.add('button-hover')}
              onMouseLeave={(e) => e.target.classList.remove('button-hover')}
              onClick={handleLogout}
            >
              <span style={styles.buttonIcon}>👋</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  body: {
    fontFamily: "Comic Sans MS",
    backgroundColor: "#fff",
    color: "#2c3e50",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/images/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
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
    animation: "gradientShift 20s ease infinite",
    zIndex: -2,
  },
  floatingElements: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  floatingElement: {
    position: "absolute",
    fontSize: "25px",
    animation: "float 8s ease-in-out infinite",
    opacity: 0.7,
  },
  container: {
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "900px",
    position: "relative",
    zIndex: 1,
    animation: "slideInUp 1s ease-out",
    border: "3px solid transparent",
    backgroundClip: "padding-box",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "3rem",
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
    animation: "bounce 3s ease-in-out infinite",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#7f8c8d",
    fontWeight: "bold",
    animation: "fadeIn 2s ease-in",
  },
  characterDisplay: {
    fontSize: "2.5rem",
    display: "inline-block",
    animation: "bounce 2s infinite",
    marginLeft: "15px",
  },
  avatarSection: {
    marginBottom: "40px",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: "30px",
  },
  avatar: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    border: "6px solid #fff",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.3)",
    objectFit: "cover",
    animation: "avatarGlow 3s ease-in-out infinite",
    transition: "all 0.3s ease",
  },
  avatarBadge: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    border: "3px solid #fff",
    animation: "bounce 2s infinite",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  statCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  pointsCard: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    animation: "pointsPulse 2s ease-in-out infinite",
  },
  statIcon: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    animation: "bounce 3s ease-in-out infinite",
  },
  statLabel: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  pointsValue: {
    fontSize: "2rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  actionButton: {
    padding: "18px 25px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    outline: "none",
    textTransform: "uppercase",
    letterSpacing: "1px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#fff",
  },
  buttonIcon: {
    fontSize: "20px",
    animation: "bounce 2s ease-in-out infinite",
  },
  insertTaskBtn: {
    background: "linear-gradient(45deg, #00b894, #00cec9)",
  },
  checkTaskBtn: {
    background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
  },
  changeKidBtn: {
    background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
  },
  logoutBtn: {
    background: "linear-gradient(45deg, #e17055, #e84393)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Comic Sans MS",
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
    fontSize: "1.2rem",
    color: "#7f8c8d",
    fontWeight: "bold",
    animation: "fadeIn 2s ease-in-out infinite",
  },
};

export default KidProfilePage;
