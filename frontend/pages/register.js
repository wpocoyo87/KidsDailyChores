import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kids, setKids] = useState([
    { id: 1, name: "", age: "", selectedAvatar: null },
  ]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const numAvatars = 8; // Number of avatar images you have (avatar1.png to avatar8.png)

  const handleAddKid = () => {
    const newKidId = kids.length + 1;
    setKids([
      ...kids,
      { id: newKidId, name: "", age: "", selectedAvatar: null },
    ]);
  };

  const handleRemoveKid = (kidId) => {
    const updatedKids = kids.filter((kid) => kid.id !== kidId);
    setKids(updatedKids);
  };

  const handleKidDetailsChange = (kidId, field, value) => {
    const updatedKids = kids.map((kid) =>
      kid.id === kidId ? { ...kid, [field]: value } : kid
    );
    setKids(updatedKids);
  };

  const handleSelectAvatar = (kidId, avatarIndex) => {
    const selectedAvatar = `/images/avatar${avatarIndex}.png`; // Constructing the URL based on index
    const updatedKids = kids.map((kid) =>
      kid.id === kidId ? { ...kid, selectedAvatar } : kid
    );
    setKids(updatedKids);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(
      "Submitting registration data...",
      username,
      email,
      password,
      kids
    );

    if (!username || !email || !password) {
      alert("Please fill out all fields for the user");
      return;
    }

    const isKidsValid = kids.every(
      (kid) => kid.name && kid.age && kid.selectedAvatar
    );
    if (!isKidsValid) {
      alert("Please fill out all fields for all kids");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          username,
          email,
          password,
          kids,
        }
      );

      console.log("Registration successful:", response.data);
      setRegistrationSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setKids([{ id: 1, name: "", age: "", selectedAvatar: null }]);
      router.push("/confirmation");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f0f0f0",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    formContainer: {
      width: "80%",
      maxWidth: "600px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    formInput: {
      width: "100%",
      marginBottom: "15px",
      padding: "10px",
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
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "16px",
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
    avatarContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    avatarOption: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "50%",
      margin: "0 5px",
      cursor: "pointer",
      border: "2px solid transparent",
      transition: "border-color 0.3s ease",
    },
    selectedAvatar: {
      borderColor: "#007bff",
    },
    submitBtn: {
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
    successMessage: {
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
      borderRadius: "4px",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h1>Register</h1>
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
          {kids.map((kid) => (
            <div key={kid.id} style={styles.kidContainer}>
              <h3>Kid {kid.id}</h3>
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
                type="number"
                value={kid.age}
                onChange={(e) =>
                  handleKidDetailsChange(kid.id, "age", e.target.value)
                }
                style={styles.kidInput}
                placeholder="Child's Age"
                required
              />
              <div style={styles.avatarContainer}>
                {[...Array(numAvatars)].map((_, index) => {
                  const avatarIndex = index + 1; // Avatar index starts from 1
                  const avatarUrl = `/images/avatar${avatarIndex}.png`;
                  return (
                    <img
                      key={avatarUrl}
                      src={avatarUrl}
                      alt={`Avatar ${avatarIndex}`}
                      style={{
                        ...styles.avatarOption,
                        ...(kid.selectedAvatar === avatarUrl
                          ? styles.selectedAvatar
                          : {}),
                      }}
                      onClick={() => handleSelectAvatar(kid.id, avatarIndex)}
                    />
                  );
                })}
              </div>
              <button type="button" onClick={() => handleRemoveKid(kid.id)}>
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
          <button type="submit" style={styles.submitBtn}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
