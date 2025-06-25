import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const KidsLoginPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: kid selection, 3: PIN
  const [parentEmail, setParentEmail] = useState("");
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const characters = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];

  useEffect(() => {
    // Character rotation
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchKidsByParentEmail = async (email) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`${apiUrl}/kids/by-parent-email`, {
        parentEmail: email
      });

      if (response.data.success) {
        const kidsData = response.data.kids;
        if (kidsData.length === 0) {
          setError("No kids found for this parent email or no PINs have been set yet.");
          return;
        }
        setKids(kidsData);
        setStep(2);
        playSound("success");
      }
    } catch (error) {
      console.error("Error fetching kids:", error);
      setError(error.response?.data?.error || "Failed to load kids data");
      playSound("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    if (!parentEmail || !parentEmail.includes("@")) {
      setError("Please enter a valid parent email address");
      return;
    }
    
    fetchKidsByParentEmail(parentEmail);
  };

  const handleKidSelection = (kid) => {
    setSelectedKid(kid);
    setStep(3);
    setPin("");
    setError("");
    playSound("click");
  };

  const handleBackToEmail = () => {
    setStep(1);
    setParentEmail("");
    setKids([]);
    setSelectedKid(null);
    setPin("");
    setError("");
    playSound("click");
  };

  const handleBackToKids = () => {
    setStep(2);
    setSelectedKid(null);
    setPin("");
    setError("");
    playSound("click");
  };

  const handleKidLogin = async (e) => {
    e.preventDefault();
    
    if (!pin || pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      playSound("error");
      return;
    }

    if (!selectedKid) {
      setError("Please select a kid profile first");
      playSound("error");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/kids/login`, {
        kidId: selectedKid._id,
        pin: pin
      });

      if (response.data.success) {
        // Store the kid's token and info in localStorage
        localStorage.setItem('kidToken', response.data.token);
        localStorage.setItem('kidId', selectedKid._id);
        localStorage.setItem('kidName', selectedKid.name);
        localStorage.setItem('kidData', JSON.stringify(selectedKid));
        localStorage.setItem('userRole', 'kid');
        
        playSound("success");
        
        // Add a small delay for the success sound
        setTimeout(() => {
          router.push("/kidDashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Kid login error:", error);
      const errorMsg = error.response?.data?.error || "Invalid PIN. Please try again.";
      setError(errorMsg);
      setPin(""); // Clear PIN on error
      playSound("error");
    } finally {
      setIsLoading(false);
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
      fontFamily: "Comic Sans MS, cursive",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
      color: "#fff",
      fontSize: "20px",
      animation: "float 6s ease-in-out infinite",
    },
    card: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: "25px",
      padding: "40px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center",
      position: "relative",
      zIndex: 1,
      animation: "slideInUp 1s ease-out",
    },
    title: {
      fontSize: "2.8rem",
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "10px",
      fontWeight: "bold",
      animation: "titleBounce 2s ease-in-out infinite",
    },
    subtitle: {
      color: "#7f8c8d",
      fontSize: "1.2rem",
      marginBottom: "30px",
      animation: "fadeIn 2s ease-in",
    },
    characterDisplay: {
      fontSize: "2.5rem",
      display: "inline-block",
      animation: "bounce 2s infinite",
      marginLeft: "10px",
    },
    kidsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "15px",
      marginBottom: "30px",
    },
    kidCard: {
      padding: "15px",
      borderRadius: "20px",
      border: "3px solid transparent",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backgroundColor: "#f8f9fa",
      animation: "kidCardSlide 0.6s ease-out",
    },
    selectedKidCard: {
      border: "3px solid #ff6b6b",
      backgroundColor: "#fff5f5",
      transform: "scale(1.05)",
      boxShadow: "0 10px 25px rgba(255, 107, 107, 0.3)",
    },
    kidAvatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "10px",
      border: "3px solid #fff",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    },
    kidName: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2d3436",
    },
    pinContainer: {
      position: "relative",
      marginBottom: "25px",
    },
    pinInput: {
      width: "100%",
      padding: "20px 50px 20px 20px",
      borderRadius: "20px",
      border: "3px solid #e1e8ed",
      fontSize: "24px",
      textAlign: "center",
      fontFamily: "Comic Sans MS, cursive",
      outline: "none",
      letterSpacing: "15px",
      transition: "all 0.3s ease",
    },
    pinInputFocus: {
      borderColor: "#4ecdc4",
      boxShadow: "0 0 20px rgba(78, 205, 196, 0.3)",
    },
    toggleButton: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
    },
    loginButton: {
      width: "100%",
      padding: "18px",
      borderRadius: "20px",
      border: "none",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      fontFamily: "Comic Sans MS, cursive",
      transition: "all 0.3s ease",
      background: "linear-gradient(45deg, #00b894, #00cec9)",
      color: "white",
      marginBottom: "15px",
      boxShadow: "0 8px 25px rgba(0, 184, 148, 0.4)",
    },
    parentButton: {
      width: "100%",
      padding: "15px",
      borderRadius: "20px",
      border: "3px solid #667eea",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      fontFamily: "Comic Sans MS, cursive",
      transition: "all 0.3s ease",
      backgroundColor: "rgba(255,255,255,0.9)",
      color: "#667eea",
    },
    errorMessage: {
      color: "#e74c3c",
      backgroundColor: "#fdf2f2",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "20px",
      border: "2px solid #e74c3c",
      animation: "errorShake 0.6s ease-in-out",
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      display: "inline-block",
      marginLeft: "10px",
    },
    emailInput: {
      width: "100%",
      padding: "18px 20px",
      borderRadius: "20px",
      border: "3px solid #e1e8ed",
      fontSize: "16px",
      fontFamily: "Comic Sans MS, cursive",
      outline: "none",
      transition: "all 0.3s ease",
      marginBottom: "20px",
    },
    emailInputFocus: {
      borderColor: "#4ecdc4",
      boxShadow: "0 0 20px rgba(78, 205, 196, 0.3)",
    },
    backButton: {
      padding: "12px 20px",
      borderRadius: "15px",
      border: "2px solid #95a5a6",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      fontFamily: "Comic Sans MS, cursive",
      transition: "all 0.3s ease",
      backgroundColor: "rgba(255,255,255,0.9)",
      color: "#95a5a6",
      marginBottom: "20px",
    },
    stepIndicator: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
      fontSize: "14px",
      color: "#7f8c8d",
    },
    stepCircle: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 10px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
    activeStep: {
      backgroundColor: "#4ecdc4",
      color: "white",
    },
    completedStep: {
      backgroundColor: "#00b894",
      color: "white",
    },
    inactiveStep: {
      backgroundColor: "#ecf0f1",
      color: "#95a5a6",
    },
  };

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
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes titleBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes kidCardSlide {
          from { opacity: 0; transform: translateX(-50px) scale(0.8); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.animatedBg}></div>
        
        <div style={styles.floatingStars}>
          {[...Array(15)].map((_, i) => (
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

        <div style={styles.card}>
          <h1 style={styles.title}>
            Kids Login! 
            <span style={styles.characterDisplay}>
              {characters[currentCharacter]}
            </span>
          </h1>

          {/* Step Indicator */}
          <div style={styles.stepIndicator}>
            <div style={{
              ...styles.stepCircle,
              ...(step === 1 ? styles.activeStep : 
                  step > 1 ? styles.completedStep : styles.inactiveStep)
            }}>
              📧
            </div>
            <div style={{ width: "20px", height: "2px", backgroundColor: step > 1 ? "#00b894" : "#ecf0f1" }}></div>
            <div style={{
              ...styles.stepCircle,
              ...(step === 2 ? styles.activeStep : 
                  step > 2 ? styles.completedStep : styles.inactiveStep)
            }}>
              👦
            </div>
            <div style={{ width: "20px", height: "2px", backgroundColor: step > 2 ? "#00b894" : "#ecf0f1" }}></div>
            <div style={{
              ...styles.stepCircle,
              ...(step === 3 ? styles.activeStep : styles.inactiveStep)
            }}>
              🔐
            </div>
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          {/* Step 1: Parent Email */}
          {step === 1 && (
            <>
              <p style={styles.subtitle}>
                Enter your parent's email address first! 📧
              </p>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  style={styles.emailInput}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  style={styles.loginButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      🔍 Finding Kids...
                      <span style={styles.loadingSpinner}></span>
                    </>
                  ) : (
                    "🔍 Find My Profile!"
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Kid Selection */}
          {step === 2 && (
            <>
              <button onClick={handleBackToEmail} style={styles.backButton}>
                ← Back to Email
              </button>
              <p style={styles.subtitle}>
                Choose your profile! 👦👧
              </p>
              <div style={styles.kidsGrid}>
                {kids.map((kid) => (
                  <div
                    key={kid._id}
                    onClick={() => handleKidSelection(kid)}
                    style={styles.kidCard}
                  >
                    <img
                      src={kid.selectedAvatar || "/images/default-avatar.png"}
                      alt={kid.name}
                      style={styles.kidAvatar}
                    />
                    <div style={styles.kidName}>
                      {kid.name}
                      <br />
                      {kid.gender === 'boy' ? '👦' : '👧'}
                      {kid.hasPinSet && <div style={{ color: '#00b894', fontSize: '12px' }}>✓ PIN Ready</div>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 3: PIN Entry */}
          {step === 3 && selectedKid && (
            <>
              <button onClick={handleBackToKids} style={styles.backButton}>
                ← Back to Profiles
              </button>
              <p style={styles.subtitle}>
                Hi {selectedKid.name}! Enter your secret PIN! 🔐
              </p>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src={selectedKid.selectedAvatar || "/images/default-avatar.png"}
                  alt={selectedKid.name}
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%", 
                    border: "3px solid #4ecdc4",
                    boxShadow: "0 0 15px rgba(78, 205, 196, 0.3)"
                  }}
                />
              </div>
              <form onSubmit={handleKidLogin}>
                <div style={styles.pinContainer}>
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="****"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    style={styles.pinInput}
                    maxLength="4"
                    pattern="\d{4}"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    style={styles.toggleButton}
                  >
                    {showPin ? "🙈" : "👁️"}
                  </button>
                </div>

                <button
                  type="submit"
                  style={styles.loginButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      🔓 Logging in...
                      <span style={styles.loadingSpinner}></span>
                    </>
                  ) : (
                    "🚀 Enter My World!"
                  )}
                </button>
              </form>
            </>
          )}

          <button
            onClick={() => router.push("/login")}
            style={styles.parentButton}
          >
            👨‍👩‍👧‍👦 Parent Login
          </button>
        </div>
      </div>
    </>
  );
};

export default KidsLoginPage;
