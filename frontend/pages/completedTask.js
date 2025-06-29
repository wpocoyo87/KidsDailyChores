"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const CongratulationsPage = () => {
  const router = useRouter()
  const { kidName } = router.query
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/listTask")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes rainbow {
          0% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
          16% { color: #ff8000; text-shadow: 0 0 10px #ff8000; }
          33% { color: #ffff00; text-shadow: 0 0 10px #ffff00; }
          50% { color: #00ff00; text-shadow: 0 0 10px #00ff00; }
          66% { color: #0080ff; text-shadow: 0 0 10px #0080ff; }
          83% { color: #8000ff; text-shadow: 0 0 10px #8000ff; }
          100% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .celebration-title {
          animation: bounce 2s infinite, rainbow 3s infinite;
        }
        
        .celebration-text {
          animation: bounce 2s infinite 0.5s;
        }
        
        .floating-emoji {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-emoji {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .progress-fill {
          animation: progress 5s linear forwards;
        }
      `}</style>

      {/* Background Particles */}
      <div style={styles.backgroundParticles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
            className="sparkle"
          >
            ✨
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Large Celebration Character */}
        <div style={styles.characterContainer}>
          <div style={styles.character} className="pulse-emoji">
            🎉
          </div>
          <div style={styles.characterShadow}></div>
        </div>

        {/* Title */}
        <h1 style={styles.title} className="celebration-title">
          🏆 Congratulations {kidName || "Champion"}! 🏆
        </h1>

        {/* Subtitle */}
        <p style={styles.subtitle} className="celebration-text">
          ⭐ You have completed your daily task! ⭐
        </p>

        {/* Achievement Badge */}
        <div style={styles.badge}>
          <div style={styles.badgeIcon}>🌟</div>
          <div style={styles.badgeText}>
            <div style={styles.badgeTitle}>Task Master!</div>
            <div style={styles.badgeSubtitle}>Keep up the amazing work!</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>Redirecting in {countdown} seconds...</div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill} className="progress-fill"></div>
          </div>
        </div>

        {/* Floating Emojis */}
        <div style={styles.floatingEmojis}>
          <span style={{ ...styles.floatingEmoji, ...styles.emoji1 }} className="floating-emoji">
            🎊
          </span>
          <span style={{ ...styles.floatingEmoji, ...styles.emoji2 }} className="floating-emoji">
            🎈
          </span>
          <span style={{ ...styles.floatingEmoji, ...styles.emoji3 }} className="floating-emoji">
            🎁
          </span>
          <span style={{ ...styles.floatingEmoji, ...styles.emoji4 }} className="floating-emoji">
            🌟
          </span>
          <span style={{ ...styles.floatingEmoji, ...styles.emoji5 }} className="floating-emoji">
            🎯
          </span>
        </div>
      </div>

      {/* Confetti Effect */}
      <div style={styles.confetti}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.confettiPiece,
              left: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: "Comic Sans MS, Comic Sans, cursive",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  backgroundParticles: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  particle: {
    position: "absolute",
    fontSize: "1.5rem",
    pointerEvents: "none",
  },
  mainContent: {
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "40px",
    borderRadius: "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    backdropFilter: "blur(20px)",
    border: "3px solid rgba(255,215,0,0.5)",
    maxWidth: "600px",
    width: "90%",
    position: "relative",
  },
  characterContainer: {
    position: "relative",
    marginBottom: "30px",
  },
  character: {
    fontSize: "8rem",
    display: "block",
    margin: "0 auto",
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
  },
  characterShadow: {
    position: "absolute",
    bottom: "-20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    height: "20px",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "50%",
    filter: "blur(10px)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0 0 20px 0",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "1.3rem",
    margin: "0 0 30px 0",
    color: "#4A90E2",
    fontWeight: "600",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    backgroundColor: "linear-gradient(135deg, #FFD700, #FFA500)",
    background: "linear-gradient(135deg, #FFD700, #FFA500)",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 10px 30px rgba(255, 215, 0, 0.4)",
  },
  badgeIcon: {
    fontSize: "3rem",
  },
  badgeText: {
    textAlign: "left",
  },
  badgeTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#8B4513",
    margin: 0,
  },
  badgeSubtitle: {
    fontSize: "1rem",
    color: "#A0522D",
    margin: 0,
  },
  progressContainer: {
    width: "100%",
    marginBottom: "20px",
  },
  progressLabel: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "10px",
    fontWeight: "600",
  },
  progressBar: {
    width: "100%",
    height: "12px",
    backgroundColor: "#E0E0E0",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #45B7D1)",
    borderRadius: "6px",
    width: "0%",
  },
  floatingEmojis: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  floatingEmoji: {
    position: "absolute",
    fontSize: "2.5rem",
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
  },
  emoji1: { top: "10%", left: "10%" },
  emoji2: { top: "20%", right: "15%" },
  emoji3: { bottom: "25%", left: "5%" },
  emoji4: { bottom: "15%", right: "10%" },
  emoji5: { top: "50%", left: "5%" },
  confetti: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 5,
  },
  confettiPiece: {
    position: "absolute",
    width: "10px",
    height: "10px",
    animation: "float 4s ease-in-out infinite",
  },
}

export default CongratulationsPage
