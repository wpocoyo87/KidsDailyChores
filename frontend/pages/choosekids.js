import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ChooseKidsPage = () => {
  const router = useRouter();
  const [selectedKid, setSelectedKid] = useState(null);
  const [kids, setKids] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinKid, setPinKid] = useState(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const characters = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKids = localStorage.getItem("kids");
      if (storedKids) {
        setKids(JSON.parse(storedKids));
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Character rotation animation
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [characters.length]);

  const handleSelection = (kid) => {
    setSelectedKid(kid);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedKid", JSON.stringify(kid));
    }
    playSuccessSound();
    router.push("/singleProfile");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("selectedKid");
      localStorage.removeItem("kids");
    }
    router.push("/");
  };

  const addNewKid = () => {
    router.push("/addKid");
  };

  const handleSetPin = (kid) => {
    setPinKid(kid);
    setShowPinModal(true);
    setPin("");
    setConfirmPin("");
    setPinError("");
    setPinSuccess("");
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^\d{4}$/.test(pin)) {
      setPinError("PIN must be exactly 4 digits");
      playErrorSound();
      return;
    }
    
    if (pin !== confirmPin) {
      setPinError("PINs do not match");
      playErrorSound();
      return;
    }

    setIsSettingPin(true);
    setPinError("");

    try {
      const response = await axios.post(
        `${apiUrl}/kids/${pinKid._id}/pin`,
        { pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Set PIN response:", response.data); // Debug log

      if (response.data.success) {
        setPinSuccess("PIN set successfully! 🎉");
        playSuccessSound();
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowPinModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error setting PIN:", error);
      console.error("Error response:", error.response?.data); // Better error logging
      let errorMsg = "Unable to save PIN. Please try again.";
      if (error.response?.status === 400) {
        errorMsg = "Invalid PIN format. Please use 4 digits only.";
      } else if (error.response?.status === 404) {
        errorMsg = "Kid profile not found. Please try again.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      setPinError(errorMsg);
      playErrorSound();
    } finally {
      setIsSettingPin(false);
    }
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAAA=";
      audio.play();
    } catch (e) {
      console.log("Audio play failed:", e);
    }
  };

  const playErrorSound = () => {
    try {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAAA=";
      audio.play();
    } catch (e) {
      console.log("Audio play failed:", e);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingEmoji}>{characters[currentCharacter]}</div>
          <div style={styles.loadingText}>Loading your amazing kids... 🌟</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <div style={styles.errorEmoji}>😰</div>
          <div style={styles.errorText}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-20px);
          }
          70% {
            transform: translateY(-10px);
          }
          90% {
            transform: translateY(-4px);
          }
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 35px rgba(255,215,0,0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
        }
        
        @keyframes rainbow {
          0% { color: #667eea; }
          16% { color: #764ba2; }
          32% { color: #f093fb; }
          48% { color: #f5576c; }
          64% { color: #4facfe; }
          80% { color: #00f2fe; }
          100% { color: #667eea; }
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .kidCard:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        
        .kidCard:hover .avatarGlow {
          opacity: 0.3;
        }
        
        .pinButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102,126,234,0.6);
        }
        
        .addButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(72,187,120,0.6);
        }
        
        .logoutButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(229,62,62,0.6);
        }
        
        .submitButton:hover {
          background-color: #5a67d8;
        }
        
        .cancelButton:hover {
          background-color: #cbd5e0;
        }
        
        .pinInput:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }
      `}</style>
      
      {showConfetti && (
        <div style={styles.confetti}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.confettiPiece,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${1 + Math.random()}rem`,
              }}
            >
              {["🎉", "✨", "🌟", "⭐", "🎊"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <div style={styles.characterContainer}>
            <span style={styles.character}>{characters[currentCharacter]}</span>
          </div>
          <h1 style={styles.title}>Choose Your Kid 👨‍👩‍👧‍👦</h1>
          <p style={styles.subtitle}>Select a profile to get started!</p>
        </div>

        {user && (
          <div style={styles.welcomeMessage}>
            <p>Hi {user.username}! 👋 Please select your kid</p>
          </div>
        )}

        <div style={styles.kidsContainer}>
          {kids.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyEmoji}>👶</div>
              <p style={styles.emptyText}>No kids registered yet!</p>
              <p style={styles.emptySubtext}>Add your first kid to get started 🎯</p>
            </div>
          ) : (
            kids.map((kid, index) => (
              <div
                key={kid._id}
                style={{
                  ...styles.kidCard,
                  animationDelay: `${index * 0.1}s`,
                  border: selectedKid && selectedKid._id === kid._id
                    ? "3px solid #FFD700"
                    : "3px solid rgba(102,126,234,0.3)",
                  boxShadow: selectedKid && selectedKid._id === kid._id
                    ? "0 15px 35px rgba(255,215,0,0.4)"
                    : "0 10px 25px rgba(0,0,0,0.1)",
                }}
              >
                <div style={styles.kidCardInner} onClick={() => handleSelection(kid)}>
                  <div style={styles.avatarContainer}>
                    <img
                      src={kid.selectedAvatar || "/images/default-avatar.png"}
                      alt={kid.name}
                      style={styles.kidAvatar}
                    />
                    <div style={styles.avatarGlow}></div>
                  </div>
                  
                  <div style={styles.kidInfo}>
                    <h3 style={styles.kidName}>{kid.name}</h3>
                    <div style={styles.kidStats}>
                      <div style={styles.statItem}>
                        <span style={styles.statIcon}>🎂</span>
                        <span style={styles.statValue}>{kid.age} years</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statIcon}>⭐</span>
                        <span style={styles.statValue}>{kid.points || 0} stars</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statIcon}>👤</span>
                        <span style={styles.statValue}>{kid.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={styles.kidActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPin(kid);
                    }}
                    style={styles.pinButton}
                  >
                    🔐 Set PIN
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.actionButtons}>
          <button onClick={addNewKid} style={styles.addButton}>
            ➕ Add New Kid
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            👋 Logout
          </button>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>🔐 Set PIN for {pinKid?.name}</h2>
              <button
                onClick={() => setShowPinModal(false)}
                style={styles.closeButton}
              >
                ❌
              </button>
            </div>
            
            <form onSubmit={handlePinSubmit} style={styles.pinForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Enter 4-digit PIN:</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength="4"
                  style={styles.pinInput}
                  placeholder="• • • •"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm PIN:</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  maxLength="4"
                  style={styles.pinInput}
                  placeholder="• • • •"
                />
              </div>
              
              {pinError && (
                <div style={styles.errorMessage}>
                  ⚠️ {pinError}
                </div>
              )}
              
              {pinSuccess && (
                <div style={styles.successMessage}>
                  ✅ {pinSuccess}
                </div>
              )}
              
              <div style={styles.modalActions}>
                <button
                  type="submit"
                  disabled={isSettingPin}
                  style={styles.submitButton}
                >
                  {isSettingPin ? "Setting PIN... 🔄" : "🔐 Set PIN"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Comic Sans MS",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
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
  
  loadingEmoji: {
    fontSize: "3rem",
    display: "block",
    marginBottom: "15px",
    animation: "bounce 1s infinite",
  },
  
  loadingText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  
  errorContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  
  errorContent: {
    textAlign: "center",
    color: "white",
    backgroundColor: "rgba(229,62,62,0.9)",
    padding: "30px",
    borderRadius: "20px",
  },
  
  errorEmoji: {
    fontSize: "3rem",
    marginBottom: "15px",
  },
  
  errorText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  
  confetti: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1000,
  },
  
  confettiPiece: {
    position: "absolute",
    fontSize: "2rem",
    animation: "confettiFall 3s linear infinite",
    willChange: "transform, opacity",
  },
  
  formContainer: {
    maxWidth: "1200px",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "25px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    border: "3px solid rgba(255,215,0,0.3)",
    animation: "slideInUp 0.8s ease-out",
  },
  
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  
  characterContainer: {
    marginBottom: "20px",
  },
  
  character: {
    fontSize: "4rem",
    display: "inline-block",
    animation: "bounce 2s infinite",
  },
  
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: "10px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    animation: "rainbow 3s infinite",
  },
  
  subtitle: {
    fontSize: "1.2rem",
    color: "#4a5568",
    fontWeight: "bold",
  },
  
  welcomeMessage: {
    backgroundColor: "rgba(102,126,234,0.1)",
    padding: "15px",
    borderRadius: "15px",
    marginBottom: "25px",
    textAlign: "center",
    border: "2px solid rgba(102,126,234,0.2)",
  },
  
  kidsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  
  emptyState: {
    textAlign: "center",
    gridColumn: "1 / -1",
    padding: "60px 20px",
    color: "#718096",
  },
  
  emptyEmoji: {
    fontSize: "4rem",
    marginBottom: "20px",
    animation: "bounce 2s infinite",
  },
  
  emptyText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  
  emptySubtext: {
    fontSize: "1rem",
  },
  
  kidCard: {
    backgroundColor: "rgba(248,250,252,0.8)",
    borderRadius: "20px",
    padding: "20px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    animation: "slideInUp 0.6s ease-out",
  },
  
  kidCardInner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "15px",
  },
  
  avatarContainer: {
    position: "relative",
    marginBottom: "15px",
  },
  
  kidAvatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "4px solid #FFD700",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    objectFit: "cover",
    transition: "all 0.3s ease",
    animation: "pulse 2s infinite",
  },
  
  avatarGlow: {
    position: "absolute",
    top: "-10px",
    left: "-10px",
    right: "-10px",
    bottom: "-10px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #FFD700, #FFA500, #FF6347)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  },
  
  kidInfo: {
    textAlign: "center",
    width: "100%",
  },
  
  kidName: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: "15px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  },
  
  kidStats: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  
  statItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "rgba(102,126,234,0.1)",
    borderRadius: "20px",
    border: "1px solid rgba(102,126,234,0.2)",
  },
  
  statIcon: {
    fontSize: "1.2rem",
  },
  
  statValue: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#4a5568",
  },
  
  kidActions: {
    display: "flex",
    justifyContent: "center",
  },
  
  pinButton: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "Comic Sans MS",
    boxShadow: "0 5px 15px rgba(102,126,234,0.4)",
  },
  
  actionButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "20px",
  },
  
  addButton: {
    fontFamily: "Comic Sans MS",
    padding: "15px 30px",
    backgroundColor: "#48bb78",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(72,187,120,0.4)",
  },
  
  logoutButton: {
    fontFamily: "Comic Sans MS",
    padding: "15px 30px",
    backgroundColor: "#e53e3e",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(229,62,62,0.4)",
  },
  
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
  },
  
  modal: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    animation: "modalSlideIn 0.4s ease-out",
  },
  
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2d3748",
    margin: 0,
  },
  
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    padding: "5px",
  },
  
  pinForm: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  
  label: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#4a5568",
  },
  
  pinInput: {
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "18px",
    textAlign: "center",
    fontFamily: "Comic Sans MS",
    letterSpacing: "8px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  
  errorMessage: {
    color: "#e53e3e",
    fontSize: "14px",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "rgba(229,62,62,0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(229,62,62,0.2)",
  },
  
  successMessage: {
    color: "#48bb78",
    fontSize: "14px",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "rgba(72,187,120,0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(72,187,120,0.2)",
  },
  
  modalActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px",
  },
  
  submitButton: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Comic Sans MS",
    transition: "all 0.3s ease",
  },
  
  cancelButton: {
    backgroundColor: "#e2e8f0",
    color: "#4a5568",
    border: "none",
    padding: "12px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Comic Sans MS",
    transition: "all 0.3s ease",
  },
};

export default ChooseKidsPage;
