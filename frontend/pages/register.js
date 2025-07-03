import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kids, setKids] = useState([
    { id: Date.now(), name: "", birthDate: "", selectedAvatar: "", gender: "" },
  ]);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState({});
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Assume we have 8 avatars
  const numAvatars = 8;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fun characters for kids
  const characters = ["🌟", "🎨", "👶", "🧒", "👦", "👧", "🎯", "🏆"];
  const welcomeMessages = [
    "Let's create your family account! 👨‍👩‍👧‍👦",
    "Ready to start your family journey? 🚀",
    "Welcome to KidsDailyChores! 🏠",
    "Time to set up your family tasks! 🦸‍♂️🦸‍♀️",
    "Let's build something amazing together! ✨",
  ];

  // Character rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [characters.length]);

  // Welcome message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setWelcomeMessage(randomMessage);
    }, 4000);
    return () => clearInterval(interval);
  }, [welcomeMessages]);

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
        case "error":
          frequency = 300;
          break;
        case "add":
          frequency = 1000;
          break;
        default:
          frequency = 600;
      }

      // Create simple beep sound
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

  const handleAddKid = () => {
    playSound("add");
    setKids([
      ...kids,
      {
        id: Date.now(),
        name: "",
        birthDate: "",
        selectedAvatar: "",
        gender: "",
      },
    ]);
  };

  const handleKidDetailsChange = (id, field, value) => {
    playSound("click");
    const newKids = kids.map((kid) =>
      kid.id === id ? { ...kid, [field]: value } : kid
    );
    setKids(newKids);
  };

  const handleSelectAvatar = (id, avatarIndex) => {
    playSound("click");
    const avatarUrl = `/images/avatar${avatarIndex}.png`;
    handleKidDetailsChange(id, "selectedAvatar", avatarUrl);
    setAvatarPickerOpen((prev) => ({ ...prev, [id]: false }));
  };

  const handleOpenAvatarPicker = (id) => {
    setAvatarPickerOpen((prev) => ({ ...prev, [id]: true }));
  };

  const handleRemoveKid = (id) => {
    playSound("error");
    setKids(kids.filter((kid) => kid.id !== id));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !username ||
      !email ||
      !password ||
      kids.some(
        (kid) =>
          !kid.name || !kid.birthDate || !kid.gender || !kid.selectedAvatar
      )
    ) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, kids }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const { token, userId } = await response.json();
      console.log("Registration successful, token:", token);
      playSound("success");

      // Save token and userId to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
      }

      setRegistrationSuccess(true);

      // Redirect to the desired page after registration
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Adjust this path as per your routes
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific error cases
      let errorMsg = "Registration failed. Please try again.";
      if (error.response?.status === 400) {
        errorMsg = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.response?.status === 422) {
        errorMsg = "Please check your information. Make sure all fields are filled correctly.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      setError(errorMsg);
    }
  };

  const styles = {
    body: {
      fontFamily: "Comic Sans MS",
      backgroundColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
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
    container: {
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      width: "90%",
      maxWidth: "700px",
      position: "relative",
      zIndex: 1,
      animation: "slideInUp 1s ease-out",
      border: "3px solid transparent",
      backgroundClip: "padding-box",
    },
    title: {
      fontSize: "3rem",
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "20px",
      animation: "titleBounce 2s ease-in-out infinite",
      textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    },
    welcomeMessageContainer: {
      marginBottom: "20px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    welcomeMessage: {
      fontSize: "1.2rem",
      color: "#7f8c8d",
      animation: "fadeInOut 4s ease-in-out infinite",
    },
    characterDisplay: {
      fontSize: "3rem",
      display: "inline-block",
      animation: "bounce 2s infinite",
      marginLeft: "10px",
    },
    formInput: {
      width: "calc(100% - 20px)",
      marginBottom: "15px",
      padding: "15px",
      border: "2px solid #e1e8ed",
      borderRadius: "25px",
      fontSize: "16px",
      backgroundColor: "#f8f9fa",
      transition: "all 0.3s ease",
      outline: "none",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    formInputFocus: {
      borderColor: "#4ecdc4",
      backgroundColor: "#fff",
      transform: "translateY(-2px)",
      boxShadow: "0 5px 20px rgba(78, 205, 196, 0.3)",
    },
    kidContainer: {
      marginBottom: "25px",
      padding: "20px",
      border: "3px solid #e1e8ed",
      borderRadius: "20px",
      backgroundColor: "linear-gradient(45deg, #ffeaa7, #fab1a0)",
      animation: "kidCardSlide 0.6s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    kidHeader: {
      fontSize: "1.5rem",
      color: "#2d3436",
      marginBottom: "15px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    kidInput: {
      width: "calc(100% - 20px)",
      marginBottom: "12px",
      padding: "12px",
      border: "2px solid #74b9ff",
      borderRadius: "15px",
      fontSize: "16px",
      backgroundColor: "#fff",
      transition: "all 0.3s ease",
      outline: "none",
    },
    avatarContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
      gap: "20px",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "15px",
      width: "100%",
      maxWidth: "500px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    avatarOption: {
      width: "90px",
      height: "90px",
      objectFit: "cover",
      borderRadius: "50%",
      cursor: "pointer",
      border: "3px solid transparent",
      transition: "all 0.3s ease",
      animation: "avatarFloat 3s ease-in-out infinite",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      display: "block",
      margin: "0 auto",
    },
    avatarOptionHover: {
      transform: "scale(1.1) rotate(5deg)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    },
    selectedAvatar: {
      border: "4px solid #ff6b6b",
      animation: "selectedPulse 1s ease-in-out infinite alternate",
      transform: "scale(1.15)",
      boxShadow: "0 0 20px rgba(255, 107, 107, 0.6)",
    },
    button: {
      width: "100%",
      padding: "15px",
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
      color: "#fff",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      marginTop: "20px",
      transition: "all 0.3s ease",
      outline: "none",
      textTransform: "uppercase",
      letterSpacing: "1px",
      position: "relative",
      overflow: "hidden",
    },
    buttonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    addKidBtn: {
      padding: "12px 20px",
      background: "linear-gradient(45deg, #00b894, #00cec9)",
      color: "#fff",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      marginBottom: "15px",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      animation: "buttonPulse 2s ease-in-out infinite",
    },
    removeKidBtn: {
      padding: "8px 15px",
      background: "linear-gradient(45deg, #e17055, #fd79a8)",
      color: "#fff",
      border: "none",
      borderRadius: "15px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      marginTop: "10px",
    },
    successMessage: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "2px solid #c3e6cb",
      borderRadius: "15px",
      animation: "successSlide 0.8s ease-out",
      fontSize: "16px",
      fontWeight: "bold",
    },
    error: {
      color: "#e74c3c",
      backgroundColor: "#fdf2f2",
      padding: "10px",
      borderRadius: "10px",
      border: "2px solid #e74c3c",
      animation: "errorShake 0.6s ease-in-out",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "20px",
      zIndex: 10,
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #4ecdc4",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <>
      <style jsx global>{`
        body, input, button, select, textarea, h1, h2, h3, h4, h5, h6, p, label, div, span {
          font-family: "Comic Sans MS";
        }
        
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
        
        @keyframes titleBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-10px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes kidCardSlide {
          from {
            opacity: 0;
            transform: translateX(-50px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes selectedPulse {
          from { box-shadow: 0 0 20px rgba(255, 107, 107, 0.6); }
          to { box-shadow: 0 0 30px rgba(255, 107, 107, 1); }
        }
        
        @keyframes buttonPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes successSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        
        .input-focus {
          border-color: #4ecdc4 !important;
          background-color: #fff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 5px 20px rgba(78, 205, 196, 0.3) !important;
        }
        
        .button-hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
        }
        
        .avatar-hover {
          transform: scale(1.1) rotate(5deg) !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
        }

        @media (max-width: 600px) {
          .avatarContainer {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            justify-content: center !important;
            max-width: 100% !important;
          }
          .avatarOption {
            width: 60px !important;
            height: 60px !important;
          }
        }

        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-flex-bar .input-icon-left {
          font-size: 24px;
          color: #b2bec3;
          margin-right: 10px;
          display: flex;
          align-items: center;
        }
        .input-flex-bar .input-icon-eye {
          font-size: 24px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          height: 100%;
        }
        @media (max-width: 600px) {
          .input-flex-bar {
            min-height: 40px !important;
            padding-top: 4px !important;
            padding-bottom: 4px !important;
          }
          .input-flex-bar .input-icon-left,
          .input-flex-bar .input-icon-eye {
            font-size: 18px !important;
          }
        }
      `}</style>
      
      <div style={styles.body}>
        {/* Animated Background */}
        <div style={styles.animatedBg}></div>
        
        {/* Floating Stars */}
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

        <div style={styles.container}>
          {isLoading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
            </div>
          )}
          
          <h1 style={styles.title}>
            Create Family Account! 👨‍👩‍👧‍👦
          </h1>
          
          <div style={styles.welcomeMessageContainer}>
            <div style={styles.welcomeMessage}>
              {welcomeMessage || "Let's create your family account! 👨‍👩‍👧‍👦"}
            </div>
            <span style={styles.characterDisplay}>
              {characters[currentCharacter]}
            </span>
          </div>

          {error && <div style={styles.error}>❌ {error}</div>}

          <form onSubmit={handleRegister}>
            {/* Parent's Name input with icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              ...styles.formInput,
              padding: 0,
              paddingLeft: '20px',
              paddingRight: '20px',
              marginBottom: '15px',
              minHeight: '56px',
              paddingTop: '8px',
              paddingBottom: '8px',
              overflow: 'hidden',
              width: '90%',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }} className="input-flex-bar">
              <span className="input-icon-left">👤</span>
              <input
                type="text"
                placeholder="Parent's Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: styles.formInput.fontSize,
                  outline: 'none',
                  fontFamily: styles.formInput.fontFamily,
                  height: '100%',
                  padding: 0,
                  margin: 0,
                }}
                onFocus={(e) => e.target.classList.add('input-focus')}
                onBlur={(e) => e.target.classList.remove('input-focus')}
                required
              />
            </div>
            {/* Email Address input with icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              ...styles.formInput,
              padding: 0,
              paddingLeft: '20px',
              paddingRight: '20px',
              marginBottom: '15px',
              minHeight: '56px',
              paddingTop: '8px',
              paddingBottom: '8px',
              overflow: 'hidden',
              width: '90%',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }} className="input-flex-bar">
              <span className="input-icon-left">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: styles.formInput.fontSize,
                  outline: 'none',
                  fontFamily: styles.formInput.fontFamily,
                  height: '100%',
                  padding: 0,
                  margin: 0,
                }}
                onFocus={(e) => e.target.classList.add('input-focus')}
                onBlur={(e) => e.target.classList.remove('input-focus')}
                required
              />
            </div>
            {/* Password input with lock and eye icon using flex */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              ...styles.formInput,
              padding: 0,
              paddingLeft: '20px',
              paddingRight: '20px',
              marginBottom: '15px',
              minHeight: '56px',
              paddingTop: '8px',
              paddingBottom: '8px',
              overflow: 'hidden',
              width: '90%',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }} className="input-flex-bar">
              <span className="input-icon-left">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: styles.formInput.fontSize,
                  outline: 'none',
                  fontFamily: styles.formInput.fontFamily,
                  height: '100%',
                  padding: 0,
                  margin: 0,
                }}
                onFocus={(e) => e.target.classList.add('input-focus')}
                onBlur={(e) => e.target.classList.remove('input-focus')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-eye"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 24,
                  marginLeft: 10,
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: 0,
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {kids.map((kid, index) => (
              <div key={kid.id} style={styles.kidContainer}>
                <div style={styles.kidHeader}>
                  👶 Kid #{index + 1} {kid.gender === 'boy' ? '👦' : kid.gender === 'girl' ? '👧' : '🧒'}
                  {kids.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKid(kid.id)}
                      style={styles.removeKidBtn}
                      onMouseEnter={(e) => e.target.classList.add('button-hover')}
                      onMouseLeave={(e) => e.target.classList.remove('button-hover')}
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
                {/* Chosen avatar above name, clickable to reopen picker */}
                {kid.selectedAvatar && !avatarPickerOpen[kid.id] && (
                  <div
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10,
                      animation: 'slideDownFade 0.5s', cursor: 'pointer',
                    }}
                    onClick={() => handleOpenAvatarPicker(kid.id)}
                    title="Click to change avatar"
                  >
                    <img
                      src={kid.selectedAvatar}
                      alt="Selected Avatar"
                      style={{ ...styles.avatarOption, marginBottom: 0, border: '3px solid #4ecdc4', boxShadow: '0 0 10px #4ecdc4' }}
                    />
                    <span style={{ fontSize: 12, color: '#4ecdc4', marginTop: 2 }}>(Change Avatar)</span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="📝 Kid's Name"
                  value={kid.name}
                  onChange={(e) => handleKidDetailsChange(kid.id, "name", e.target.value)}
                  style={styles.kidInput}
                  onFocus={(e) => e.target.classList.add('input-focus')}
                  onBlur={(e) => e.target.classList.remove('input-focus')}
                  required
                />
                <input
                  type="date"
                  placeholder="🎂 Birth Date"
                  value={kid.birthDate}
                  onChange={(e) => handleKidDetailsChange(kid.id, "birthDate", e.target.value)}
                  style={styles.kidInput}
                  onFocus={(e) => e.target.classList.add('input-focus')}
                  onBlur={(e) => e.target.classList.remove('input-focus')}
                  required
                />
                <select
                  value={kid.gender}
                  onChange={(e) => handleKidDetailsChange(kid.id, "gender", e.target.value)}
                  style={styles.kidInput}
                  onFocus={(e) => e.target.classList.add('input-focus')}
                  onBlur={(e) => e.target.classList.remove('input-focus')}
                  required
                >
                  <option value="">👶 Select Gender</option>
                  <option value="boy">👦 Boy</option>
                  <option value="girl">👧 Girl</option>
                </select>
                {/* Avatar picker only if open or not yet chosen */}
                {(!kid.selectedAvatar || avatarPickerOpen[kid.id]) && (
                  <div style={styles.avatarContainer}>
                    <p style={{ width: '100%', textAlign: 'center', margin: '0 0 10px 0', color: '#2d3436', fontWeight: 'bold' }}>
                      🎨 Choose Avatar:
                    </p>
                    {[...Array(numAvatars)].map((_, avatarIndex) => {
                      const avatarNumber = avatarIndex + 1;
                      const avatarUrl = `/images/avatar${avatarNumber}.png`;
                      const isSelected = kid.selectedAvatar === avatarUrl;
                      return (
                        <img
                          key={avatarNumber}
                          src={avatarUrl}
                          alt={`Avatar ${avatarNumber}`}
                          style={{
                            ...styles.avatarOption,
                            ...(isSelected ? styles.selectedAvatar : {}),
                          }}
                          onClick={() => handleSelectAvatar(kid.id, avatarNumber)}
                          onMouseEnter={(e) => !isSelected && e.target.classList.add('avatar-hover')}
                          onMouseLeave={(e) => e.target.classList.remove('avatar-hover')}
                        />
                      );
                    })}
                  </div>
                )}
                {/* Add Another Kid button after last kid */}
                {index === kids.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddKid}
                    style={styles.addKidBtn}
                    onMouseEnter={(e) => e.target.classList.add('button-hover')}
                    onMouseLeave={(e) => e.target.classList.remove('button-hover')}
                  >
                    ➕ Add Another Kid
                  </button>
                )}
              </div>
            ))}

            {registrationSuccess && (
              <div style={styles.successMessage}>
                🎉 Registration successful! Welcome to the family! Redirecting to login...
              </div>
            )}

            <button 
              type="submit" 
              style={styles.button}
              onMouseEnter={(e) => e.target.classList.add('button-hover')}
              onMouseLeave={(e) => e.target.classList.remove('button-hover')}
              disabled={isLoading}
            >
              🚀 Create Family Account
            </button>
          </form>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ecdc4',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                🏠 Login Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
