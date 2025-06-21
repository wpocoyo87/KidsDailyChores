import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ChooseKidsPage = () => {
  const router = useRouter();
  const [selectedKid, setSelectedKid] = useState(null);
  const [kids, setKids] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKids = localStorage.getItem("kids");
      if (storedKids) {
        setKids(JSON.parse(storedKids));
      }
      setLoading(false); // Stop loading once data is retrieved or not found
    }
  }, []);

  const handleSelection = (kid) => {
    setSelectedKid(kid);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedKid", JSON.stringify(kid));
    }
    router.push("/singleProfile");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("selectedKid");
      localStorage.removeItem("kids"); // Also remove kids data on logout
    }
    router.push("/");
  };

  const addNewKid = () => {
    router.push("/addKid");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>List of Kids</h1>
        {user && (
          <div>
            <p>Hi {user.username}! Please select your kid</p>
          </div>
        )}
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
                  src={kid.selectedAvatar || "/images/default-avatar.png"}
                  alt={kid.name}
                  style={styles.kidAvatar}
                />
                <span style={styles.kidName}>{kid.name}</span>
                <div style={styles.kidDetails}>
                  <p>Gender: {kid.gender}</p>
                  <p>Age: {kid.age}</p>
                  <p>Points: {kid.points || 0}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <button onClick={addNewKid} style={styles.addButton}>
          Add New Kid
        </button>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
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
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  kidsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    textAlign: "center",
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
  kidDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "5px",
  },
  addButton: {
    fontFamily: "Comic Sans MS, cursive",
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textDecoration: "none",
  },
  logoutButton: {
    fontFamily: "Comic Sans MS, cursive",
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#DF935A",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ChooseKidsPage;
