import React, { useState } from "react";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kids, setKids] = useState([
    { id: Date.now(), name: "", birthDate: "", selectedAvatar: "", gender: "" },
  ]);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Assume we have 8 avatars
  const numAvatars = 8;

  const handleAddKid = () => {
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
    const newKids = kids.map((kid) =>
      kid.id === id ? { ...kid, [field]: value } : kid
    );
    setKids(newKids);
  };

  const handleSelectAvatar = (id, avatarIndex) => {
    const avatarUrl = `/images/avatar${avatarIndex}.png`;
    handleKidDetailsChange(id, "selectedAvatar", avatarUrl);
  };

  const handleRemoveKid = (id) => {
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
      const response = await fetch("http://localhost:5000/api/users/register", {
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
      setError("Registration failed. Please try again.");
    }
  };

  const styles = {
    body: {
      fontFamily: "Comic Sans MS, cursive",
      backgroundColor: "rgb(var(--background-start-rgb))",
      color: "rgb(var(--foreground-rgb))",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('/images/background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    container: {
      textAlign: "center",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      width: "80%",
      maxWidth: "600px",
    },
    formInput: {
      width: "100%",
      marginBottom: "15px",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "16px",
    },
    kidContainer: {
      marginBottom: "20px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    kidInput: {
      width: "100%",
      marginBottom: "10px",
      padding: "8px",
      border: "1px solid #007bff",
      borderRadius: "4px",
      fontSize: "16px",
    },
    avatarContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10px",
    },
    avatarOption: {
      width: "60px", // Increased size
      height: "60px", // Increased size
      objectFit: "cover",
      borderRadius: "50%",
      margin: "0 5px",
      cursor: "pointer",
      border: "2px solid transparent",
      transition: "border-color 0.3s ease",
    },
    selectedAvatar: {
      borderColor: "red", // Initial red border color
      animation: "shining 1.5s infinite alternate", // Shining effect
    },
    "@keyframes shining": {
      "0%": { borderColor: "red" },
      "100%": { borderColor: "pink" },
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "15px",
    },
    addKidBtn: {
      padding: "8px 16px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginBottom: "10px",
    },
    successMessage: {
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      borderRadius: "4px",
    },
    error: {
      color: "red",
    },
    taskImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      overflow: "hidden",
      position: "relative",
      cursor: "pointer",
      border: "3px solid #90EE90", // Soft green border
    },
    deleteButton: {
      cursor: "pointer",
      borderRadius: "8px", // Rounded corners
      padding: "5px",
      backgroundColor: "transparent",
      border: "none",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Register</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.formInput}
            placeholder="Username"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.formInput}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.formInput}
            placeholder="Password"
            required
          />
          {kids.map((kid, index) => (
            <div key={kid.id} style={styles.kidContainer}>
              <h3>Kid {index + 1}</h3>
              <input
                type="text"
                value={kid.name}
                onChange={(e) =>
                  handleKidDetailsChange(kid.id, "name", e.target.value)
                }
                style={styles.kidInput}
                placeholder="Child's Name"
                required
              />
              <input
                type="date"
                value={kid.birthDate}
                onChange={(e) =>
                  handleKidDetailsChange(kid.id, "birthDate", e.target.value)
                }
                style={styles.kidInput}
                required
              />
              <div style={styles.avatarContainer}>
                {[...Array(numAvatars)].map((_, avatarIndex) => {
                  const avatarNum = avatarIndex + 1;
                  const avatarUrl = `/images/avatar${avatarNum}.png`;
                  return (
                    <img
                      key={avatarUrl}
                      src={avatarUrl}
                      alt={`Avatar ${avatarNum}`}
                      style={{
                        ...styles.avatarOption,
                        ...(kid.selectedAvatar === avatarUrl
                          ? styles.selectedAvatar
                          : {}),
                      }}
                      onClick={() => handleSelectAvatar(kid.id, avatarNum)}
                    />
                  );
                })}
              </div>
              <select
                value={kid.gender}
                onChange={(e) =>
                  handleKidDetailsChange(kid.id, "gender", e.target.value)
                }
                style={styles.kidInput}
                required
              >
                <option value="">Select Gender</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveKid(kid.id)}
                style={styles.addKidBtn}
              >
                Remove Kid
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddKid} style={styles.addKidBtn}>
            Add Kid
          </button>
          {registrationSuccess && (
            <div style={styles.successMessage}>
              User successfully registered! Please confirm registration before
              proceeding.
            </div>
          )}
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
