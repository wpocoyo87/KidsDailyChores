import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const MainPage = () => {
  const router = useRouter();
  const [selectedKid, setSelectedKid] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        const selectedKidData = JSON.parse(localStorage.getItem("selectedKid"));
        setSelectedKid(selectedKidData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, e.g., redirect to login page or show error message
      }
    };

    fetchUserData();
  }, []); // Fetch user data only once when the component mounts

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedKid");
    router.push("/login");
  };

  if (!selectedKid) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Welcome, {user && user.username}</h1>
        <div style={styles.avatarContainer}>
          <img
            src={selectedKid.selectedAvatar || "/images/default-avatar.png"} // Use default avatar if selectedAvatar is not available
            alt={`Avatar of ${selectedKid.name}`}
            style={styles.avatar}
          />
        </div>
        <p>Stars Earned: {selectedKid.stars}</p>
        <div style={styles.links}>
          <Link href="/insertTask">
            <button style={styles.button}>Insert Task</button>
          </Link>
          <Link href="/checkedTask">
            <button style={styles.button}>Checked Task</button>
          </Link>
          <Link href="/choosekids">
            <button style={styles.button}>Change Kid</button>
          </Link>
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        </div>
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
  container: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "4px solid #007bff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    objectFit: "cover",
  },
  links: {
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    margin: "5px",
  },
};

export default MainPage;
