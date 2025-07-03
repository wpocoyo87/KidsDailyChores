import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const AddKidPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleAddKid = async (e) => {
    e.preventDefault();

    if (!name || !birthDate || !gender || !selectedAvatar) {
      alert("Please fill out all fields");
      return;
    }

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();

    try {
      const response = await fetch(`${apiUrl}/kids/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, birthDate, selectedAvatar, age, gender }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const newKid = await response.json();
      console.log("Kid added successfully:", newKid);

      // Redirect to ChooseKidsPage
      router.push("/choosekids");
    } catch (error) {
      console.error("Error adding kid:", error);
      
      // Handle specific error cases
      let errorMsg = "Failed to add kid. Please try again.";
      if (error.response?.status === 400) {
        errorMsg = "Please check the kid's information. All fields are required.";
      } else if (error.response?.status === 409) {
        errorMsg = "A kid with this name already exists. Please choose a different name.";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error. Please try again later.";
      }
      
      setError(errorMsg);
    }
  };

  const handleReturnHome = () => {
    router.push("/choosekids");
  };

  const styles = {
    body: {
      fontFamily: "Comic Sans MS",
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
    returnButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#ffa500", // Soft orange color
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "15px",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Add New Kid</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleAddKid}>
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
          <button type="submit" style={styles.button}>
            Add Kid
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

export default AddKidPage;
