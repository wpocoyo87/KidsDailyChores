import React, { useState } from "react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const { token, _id: userId } = await response.json(); // Ensure the response includes the userId
      console.log("Login successful, token:", token);

      // Save token and userId to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
      }

      // Redirect to the desired page after login
      router.push("/choosekids"); // Adjust this path as per your routes
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h1>Login Page</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.formInput}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.formInput}
            required
          />
          <button type="submit" style={styles.submitBtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
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
  formContainer: {
    maxWidth: "400px",
    padding: "19px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  formInput: {
    width: "94%",
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  submitBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
};

export default LoginPage;
