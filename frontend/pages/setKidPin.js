import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const SetKidPin = () => {
  const router = useRouter();
  const { kidId } = router.query;
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const emojis = ["🔐", "🔑", "🛡️", "🔒", "🎯", "⭐", "✨", "🌟"];

  useEffect(() => {
    // Check if parent is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'parent') {
      router.push('/login');
      return;
    }

    // Emoji rotation
    const interval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % emojis.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [router, emojis.length]);

  const handleSetPin = async (e) => {
    e.preventDefault();
    
    if (!pin || pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must contain only numbers");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/kids/set-pin`,
        {
          kidId: kidId,
          pin: pin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        playSound("success");
        
        setTimeout(() => {
          router.push("/choosekids");
        }, 2000);
      }
    } catch (error) {
      console.error("Set PIN error:", error);
      setError(error.response?.data?.error || "Failed to set PIN");
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
      fontFamily: "Comic Sans MS",
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
      fontSize: "2.5rem",
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
    emojiDisplay: {
      fontSize: "2.5rem",
      display: "inline-block",
      animation: "bounce 2s infinite",
      marginLeft: "10px",
    },
    inputContainer: {
      position: "relative",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "18px 50px 18px 20px",
      borderRadius: "20px",
      border: "3px solid #e1e8ed",
      fontSize: "24px",
      textAlign: "center",
      fontFamily: "Comic Sans MS",
      outline: "none",
      letterSpacing: "15px",
      transition: "all 0.3s ease",
    },
    inputFocus: {
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
    button: {
      width: "100%",
      padding: "18px",
      borderRadius: "20px",
      border: "none",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      fontFamily: "Comic Sans MS",
      transition: "all 0.3s ease",
      marginBottom: "15px",
    },
    setPinButton: {
      background: "linear-gradient(45deg, #00b894, #00cec9)",
      color: "white",
      boxShadow: "0 8px 25px rgba(0, 184, 148, 0.4)",
    },
    backButton: {
      background: "rgba(255,255,255,0.9)",
      color: "#667eea",
      border: "3px solid #667eea",
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
    successMessage: {
      color: "#00b894",
      backgroundColor: "#f0fff4",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "20px",
      border: "2px solid #00b894",
      animation: "successBounce 0.6s ease-in-out",
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
  };

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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes successBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.animatedBg}></div>
        
        <div style={styles.card}>
          <h1 style={styles.title}>
            Set Kid PIN
            <span style={styles.emojiDisplay}>
              {emojis[currentEmoji]}
            </span>
          </h1>

          <p style={styles.subtitle}>
            Create a secure 4-digit PIN for your child 🔐
          </p>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && (
            <div style={styles.successMessage}>
              ✅ PIN set successfully! Redirecting...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSetPin}>
              <div style={styles.inputContainer}>
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="****"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  style={styles.input}
                  maxLength="4"
                  pattern="\d{4}"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={styles.toggleButton}
                >
                  {showPin ? "🙈" : "👁️"}
                </button>
              </div>

              <div style={styles.inputContainer}>
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  style={styles.input}
                  maxLength="4"
                  pattern="\d{4}"
                  required
                />
              </div>

              <button
                type="submit"
                style={{...styles.button, ...styles.setPinButton}}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    🔐 Setting PIN...
                    <span style={styles.loadingSpinner}></span>
                  </>
                ) : (
                  "🔐 Set PIN"
                )}
              </button>
            </form>
          )}

          <button
            onClick={() => {
              playSound("click");
              router.push("/choosekids");
            }}
            style={{...styles.button, ...styles.backButton}}
          >
            ← Back to Kids
          </button>
        </div>
      </div>
    </>
  );
};

export default SetKidPin;
