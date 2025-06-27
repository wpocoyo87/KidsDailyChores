import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const SetKidPinPage = () => {
  const router = useRouter();
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      const token = localStorage.getItem("token");
      const kidsData = localStorage.getItem("kids");
      
      if (kidsData) {
        setKids(JSON.parse(kidsData));
      }
    } catch (error) {
      console.error("Error fetching kids:", error);
      setError("Failed to load kids data");
    }
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    
    if (!selectedKid) {
      setError("Please select a kid");
      return;
    }
    
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${apiUrl}/kids/${selectedKid._id}/pin`,
        { pin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(`PIN set successfully for ${selectedKid.name}! 🎉`);
      setPin("");
      setConfirmPin("");
      setSelectedKid(null);
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        router.push("/choosekids");
      }, 2000);
      
    } catch (error) {
      console.error("Error setting PIN:", error);
      setError(error.response?.data?.error || "Failed to set PIN");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePin = async (kidId, kidName) => {
    if (!confirm(`Are you sure you want to remove PIN for ${kidName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`${apiUrl}/kids/${kidId}/pin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`PIN removed successfully for ${kidName}! 🗑️`);
      
    } catch (error) {
      console.error("Error removing PIN:", error);
      setError(error.response?.data?.error || "Failed to remove PIN");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      padding: "20px",
      fontFamily: "'Gloria Hallelujah', cursive",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "500px",
      textAlign: "center",
    },
    title: {
      fontSize: "2.5rem",
      background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    subtitle: {
      color: "#7f8c8d",
      fontSize: "1.1rem",
      marginBottom: "30px",
    },
    select: {
      width: "100%",
      padding: "15px",
      borderRadius: "15px",
      border: "2px solid #e1e8ed",
      fontSize: "16px",
      marginBottom: "20px",
      fontFamily: "'Gloria Hallelujah', cursive",
      outline: "none",
    },
    inputContainer: {
      position: "relative",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "15px 50px 15px 15px",
      borderRadius: "15px",
      border: "2px solid #e1e8ed",
      fontSize: "20px",
      textAlign: "center",
      fontFamily: "'Gloria Hallelujah', cursive",
      outline: "none",
      letterSpacing: "10px",
    },
    toggleButton: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
    },
    button: {
      width: "100%",
      padding: "15px",
      borderRadius: "15px",
      border: "none",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      marginBottom: "15px",
      fontFamily: "'Gloria Hallelujah', cursive",
      transition: "all 0.3s ease",
    },
    primaryButton: {
      background: "linear-gradient(45deg, #00b894, #00cec9)",
      color: "white",
    },
    secondaryButton: {
      background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
      color: "white",
    },
    removeButton: {
      background: "linear-gradient(45deg, #e17055, #e84393)",
      color: "white",
      padding: "8px 15px",
      fontSize: "14px",
      marginLeft: "10px",
    },
    kidItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      marginBottom: "10px",
    },
    kidInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    successMessage: {
      color: "#00b894",
      backgroundColor: "#d4edda",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "20px",
      border: "2px solid #00b894",
    },
    errorMessage: {
      color: "#e74c3c",
      backgroundColor: "#fdf2f2",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "20px",
      border: "2px solid #e74c3c",
    },
    kidsSection: {
      marginTop: "30px",
      textAlign: "left",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Kids PIN Setup</h1>
        <p style={styles.subtitle}>
          Set up secure 4-digit PINs for your kids to access their tasks safely!
        </p>

        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSetPin}>
          <select
            value={selectedKid?._id || ""}
            onChange={(e) => {
              const kid = kids.find(k => k._id === e.target.value);
              setSelectedKid(kid);
            }}
            style={styles.select}
            required
          >
            <option value="">👶 Select a kid</option>
            {kids.map((kid) => (
              <option key={kid._id} value={kid._id}>
                {kid.name} ({kid.gender === 'boy' ? '👦' : '👧'})
              </option>
            ))}
          </select>

          <div style={styles.inputContainer}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={styles.input}
              maxLength="4"
              pattern="\d{4}"
              title="Please enter exactly 4 digits"
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

          <div style={styles.inputContainer}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              style={styles.input}
              maxLength="4"
              pattern="\d{4}"
              title="Please confirm your 4-digit PIN"
              required
            />
          </div>

          <button
            type="submit"
            style={{...styles.button, ...styles.primaryButton}}
            disabled={isLoading}
          >
            {isLoading ? "Setting PIN... 🔄" : "🔒 Set PIN"}
          </button>
        </form>

        <button
          onClick={() => router.push("/choosekids")}
          style={{...styles.button, ...styles.secondaryButton}}
        >
          🏠 Back to Kids
        </button>

        {kids.length > 0 && (
          <div style={styles.kidsSection}>
            <h3>👨‍👩‍👧‍👦 Your Kids:</h3>
            {kids.map((kid) => (
              <div key={kid._id} style={styles.kidItem}>
                <div style={styles.kidInfo}>
                  <img
                    src={kid.selectedAvatar || "/images/default-avatar.png"}
                    alt={kid.name}
                    style={styles.avatar}
                  />
                  <span>{kid.name}</span>
                  <span>{kid.gender === 'boy' ? '👦' : '👧'}</span>
                </div>
                <button
                  onClick={() => handleRemovePin(kid._id, kid.name)}
                  style={{...styles.button, ...styles.removeButton}}
                >
                  🗑️ Remove PIN
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetKidPinPage;
