import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ChooseKidsPage = () => {
  const router = useRouter();
  const [selectedKid, setSelectedKid] = useState(null);
  const [kids, setKids] = useState([]);
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
        setKids(response.data.kids); // Assuming response.data contains kids array
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, e.g., redirect to login page or show error message
      }
    };

    fetchUserData();
  }, []); // Add router as a dependency to re-fetch data when navigating to /choosekids

  const handleSelection = (kid) => {
    setSelectedKid(kid);
    localStorage.setItem("selectedKid", JSON.stringify(kid));
    router.push("/main"); // Redirect to the main page after selecting a kid
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Select a Kid</h1>
        {user && <p>Welcome, {user.username}</p>}
        <div style={styles.kidsContainer}>
          {kids.length === 0 ? (
            <p>No kids registered.</p>
          ) : (
            kids.map((kid) => (
              <div
                key={kid._id}
                style={{
                  ...styles.kidCard,
                  border:
                    selectedKid && selectedKid._id === kid._id
                      ? "2px solid #007bff"
                      : "1px solid #ccc",
                }}
                onClick={() => handleSelection(kid)}
              >
                <img
                  src={kid.selectedAvatar || "/images/default-avatar.png"} // Use default avatar if selectedAvatar is not available
                  alt={kid.name}
                  style={styles.kidAvatar}
                />
                <span style={styles.kidName}>{kid.name}</span>
              </div>
            ))
          )}
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
  formContainer: {
    maxWidth: "600px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  kidsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  kidCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "border 0.3s",
  },
  kidAvatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  kidName: {
    fontWeight: "bold",
    marginTop: "5px",
  },
};

export default ChooseKidsPage;
