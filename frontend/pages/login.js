"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState(0)
  const [welcomeMessage, setWelcomeMessage] = useState("")

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Fun characters for kids
  const characters = ["🦸‍♂️", "🦸‍♀️", "🐻", "🦄", "🐸", "🦊", "🐱", "🐰"]
  const welcomeMessages = [
    "Welcome back, Super Hero! 🦸‍♂️",
    "Ready for more adventures? 🌟",
    "Let&apos;s create some awesome tasks! 🎯",
    "Time to be amazing! ✨",
    "Your daily missions await! 🚀",
  ]

  // Character rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [characters.length])

  // Welcome message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
      setWelcomeMessage(randomMessage)
    }, 3000)
    return () => clearInterval(interval)
  }, [welcomeMessages])

  // Sound effects
  const playSound = (type) => {
    try {
      let frequency
      switch (type) {
        case "click":
          frequency = 800
          break
        case "success":
          frequency = 1000
          break
        case "error":
          frequency = 300
          break
        default:
          frequency = 600
      }

      // Create simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("Audio not available:", error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("🚨 Oops! Please fill in both email and password! 🚨")
      playSound("error")
      return
    }

    setIsLoading(true)
    setError(null)
    playSound("click")

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text)
      }

      const data = await response.json()
      const { token, _id: userId, kids } = data
      console.log("Login successful, token:", token, "kids:", kids)

      // Save token and user data to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
        localStorage.setItem("kids", JSON.stringify(kids))
        localStorage.setItem("email", email)
      }

      playSound("success")
      // Redirect to the desired page after login
      router.push("/choosekids")
    } catch (error) {
      console.error("Login error:", error)
      setError("🔐 Hmm, that doesn&apos;t look right! Check your email and password! 🔐")
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  const styles = {
    body: {
      fontFamily: "Comic Sans MS, Comic Sans, cursive",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
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
    formContainer: {
      maxWidth: "450px",
      width: "90%",
      padding: "40px",
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: "25px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      backdropFilter: "blur(20px)",
      border: "3px solid rgba(255,215,0,0.5)",
      position: "relative",
      zIndex: 10,
      animation: "slideInUp 0.8s ease-out",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
    },
    characterDisplay: {
      fontSize: "4rem",
      marginBottom: "15px",
      animation: "bounce 2s infinite",
      display: "block",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#2d3748",
      marginBottom: "10px",
      animation: "rainbow 3s infinite",
    },
    subtitle: {
      fontSize: "1.1rem",
      color: "#4a5568",
      marginBottom: "10px",
    },
    welcomeMessage: {
      fontSize: "1rem",
      color: "#667eea",
      fontWeight: "bold",
      animation: "pulse 2s infinite",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    inputGroup: {
      position: "relative",
    },
    label: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#2d3748",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    formInput: {
      width: "100%",
      padding: "15px 20px",
      border: "3px solid #e2e8f0",
      borderRadius: "15px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s ease",
      fontFamily: "Comic Sans MS, Comic Sans, cursive",
      backgroundColor: "rgba(255,255,255,0.9)",
      boxSizing: "border-box",
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    passwordToggle: {
      position: "absolute",
      right: "35px",
      background: "none",
      border: "none",
      fontSize: "1.2rem",
      cursor: "pointer",
      padding: "5px",
      borderRadius: "50%",
      transition: "all 0.2s ease",
    },
    submitBtn: {
      width: "100%",
      padding: "18px 30px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "20px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "Comic Sans MS, Comic Sans, cursive",
      boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    loadingBtn: {
      background: "linear-gradient(135deg, #a0aec0 0%, #718096 100%)",
      cursor: "not-allowed",
    },
    error: {
      color: "#e53e3e",
      backgroundColor: "rgba(254,226,226,0.8)",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "20px",
      textAlign: "center",
      fontWeight: "bold",
      border: "2px solid #feb2b2",
      animation: "shake 0.5s ease-in-out",
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    decorativeElements: {
      position: "absolute",
      top: "-10px",
      right: "-10px",
      fontSize: "2rem",
      animation: "wiggle 2s infinite",
    },
    inputIcon: {
      fontSize: "1.2rem",
    },
  }

  return (
    <div style={styles.body}>
      <style jsx>{`
        @keyframes slideInUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
          transform: scale(1.02);
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(102,126,234,0.5);
        }
        
        .password-toggle:hover {
          background-color: rgba(102,126,234,0.1);
        }
        
        .form-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0,0,0,0.35);
        }
        
        @media (max-width: 600px) {
          .password-toggle {
            display: none !important;
          }
        }
      `}</style>

      {/* Background floating elements */}
      <div style={styles.backgroundElements}>
        <div style={{ ...styles.floatingElement, top: "10%", left: "10%", animationDelay: "0s" }}>🎮</div>
        <div style={{ ...styles.floatingElement, top: "20%", right: "15%", animationDelay: "1s" }}>⭐</div>
        <div style={{ ...styles.floatingElement, bottom: "30%", left: "5%", animationDelay: "2s" }}>🎯</div>
        <div style={{ ...styles.floatingElement, bottom: "20%", right: "10%", animationDelay: "3s" }}>🏆</div>
        <div style={{ ...styles.floatingElement, top: "50%", left: "3%", animationDelay: "4s" }}>🌟</div>
        <div style={{ ...styles.floatingElement, top: "60%", right: "5%", animationDelay: "5s" }}>🎨</div>
      </div>

      <div style={styles.formContainer} className="form-container">
        {/* Decorative elements */}
        <div style={styles.decorativeElements}>✨</div>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.characterDisplay}>{characters[currentCharacter]}</span>
          <h1 style={styles.title}>🎮 Login 🎮</h1>
          <p style={styles.subtitle}>Welcome back, Super Star!</p>
          <p style={styles.welcomeMessage}>{welcomeMessage || "Ready for your next adventure? 🚀"}</p>
        </div>

        {/* Error message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Login form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.inputIcon}>📧</span>
              Parent&apos;s Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.formInput}
              className="form-input"
              placeholder="Enter your magical email address..."
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.inputIcon}>🔐</span>
              Secret Password:
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.formInput}
                className="form-input"
                placeholder="Enter your super secret password..."
                required
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword)
                  playSound("click")
                }}
                style={styles.passwordToggle}
                className="password-toggle"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(isLoading ? styles.loadingBtn : {}),
            }}
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div style={styles.loadingSpinner}></div>
                Logging in...
              </>
            ) : (
              <>🚀 Start My Adventure!</>
            )}
          </button>
        </form>

        {/* Fun facts */}
        <div style={{ textAlign: "center", marginTop: "20px", color: "#718096", fontSize: "0.9rem" }}>
          <p>🌟 Fun Fact: You&apos;re about to create amazing memories! 🌟</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
