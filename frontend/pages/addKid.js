import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axiosInstance";

const AddKidPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const characters = ["🌟", "⭐", "✨", "🎯", "🏆", "🎪", "🎨", "🚀"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [characters.length]);

  const handleAddKid = async (e) => {
    e.preventDefault();
    if (!name || !birthDate || !gender || !selectedAvatar) {
      alert("Please fill out all fields");
      return;
    }
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    setIsLoading(true);
    try {
      await api.post("/kids/add", {
        name,
        birthDate,
        selectedAvatar,
        age,
        gender,
      });
      // Fetch latest kids and redirect
      router.push("/choosekids");
    } catch (error) {
      let errorMsg = "Failed to add kid. Please try again.";
      if (error.response?.status === 400) {
        errorMsg =
          "Please check the kid's information. All fields are required.";
      } else if (error.response?.status === 409) {
        errorMsg =
          "A kid with this name already exists. Please choose a different name.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    router.push("/choosekids");
  };

  return (
    <div style={styles.body}>
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-10px) scale(1.1);
          }
          60% {
            transform: translateY(-5px) scale(1.05);
          }
        }
        @keyframes avatarGlow {
          0% {
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
          }
          50% {
            box-shadow: 0 0 40px rgba(78, 205, 196, 0.8);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div style={styles.animatedBg}></div>
      <div style={styles.container}>
        <h1 style={styles.title}>
          Add New Kid{" "}
          <span style={styles.character}>{characters[currentCharacter]}</span>
        </h1>
        <div style={styles.subtitle}>Create a new profile for your family!</div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleAddKid} style={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.formInput}
            placeholder="Child's Name"
            required
          />
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={styles.formInput}
            required
          />
          <div style={styles.avatarPickerLabel}>Choose Avatar:</div>
          <div style={styles.avatarContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <img
                key={index}
                src={`/images/avatar${index}.png`}
                alt={`Avatar ${index}`}
                style={{
                  ...styles.avatarOption,
                  ...(selectedAvatar === `/images/avatar${index}.png`
                    ? styles.selectedAvatar
                    : {}),
                }}
                onClick={() => setSelectedAvatar(`/images/avatar${index}.png`)}
              />
            ))}
          </div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={styles.formInput}
            required
          >
            <option value="">Select Gender</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? <span style={styles.spinner}></span> : "Add Kid"}
          </button>
          <button
            type="button"
            onClick={handleReturnHome}
            style={styles.returnButton}
          >
            Return to Home Page
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Comic Sans MS",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  animatedBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)",
    backgroundSize: "600% 600%",
    animation: "gradientShift 20s ease infinite",
    zIndex: -2,
  },
  container: {
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
    zIndex: 1,
    border: "3px solid transparent",
    backgroundClip: "padding-box",
  },
  title: {
    fontSize: "2.2rem",
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
    animation: "bounce 3s ease-in-out infinite",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  character: {
    fontSize: "2rem",
    display: "inline-block",
    animation: "bounce 2s infinite",
    marginLeft: "10px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#7f8c8d",
    fontWeight: "bold",
    animation: "fadeIn 2s ease-in",
    marginBottom: "25px",
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#fdf2f2",
    padding: "10px",
    borderRadius: "10px",
    border: "2px solid #e74c3c",
    marginBottom: "15px",
    animation: "bounce 0.6s ease-in-out",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formInput: {
    width: "100%",
    marginBottom: "15px",
    padding: "12px",
    border: "2px solid #e1e8ed",
    borderRadius: "25px",
    fontSize: "16px",
    backgroundColor: "#f8f9fa",
    transition: "all 0.3s ease",
    outline: "none",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  avatarPickerLabel: {
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: "8px",
    marginTop: "5px",
    textAlign: "left",
    width: "100%",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "15px",
    gap: "10px",
    width: "100%",
    flexWrap: "wrap",
  },
  avatarOption: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "50%",
    cursor: "pointer",
    border: "3px solid transparent",
    transition: "all 0.3s ease",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "block",
    margin: "0 auto",
  },
  selectedAvatar: {
    border: "4px solid #ff6b6b",
    animation: "avatarGlow 1.5s infinite alternate",
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
  spinner: {
    width: "24px",
    height: "24px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #4ecdc4",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
    verticalAlign: "middle",
  },
  returnButton: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(45deg, #ffa500, #fdcb6e)",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "15px",
    transition: "all 0.3s ease",
  },
};

export default AddKidPage;
