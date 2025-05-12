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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Token:", token);
        console.log("Email:", email);

        if (!token || !email) {
          throw new Error("No token or email found. Please log in again.");
        }

        // Fetch user data using the token and email
        const response = await axios.get(
          `http://localhost:5000/api/users/profile/${email}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;
        setUser(userData);

        // Fetch points for each kid and update the kids state
        const updatedKids = await Promise.all(
          userData.kids.map(async (kid) => {
            const pointsResponse = await axios.get(
              `http://localhost:5000/api/kids/${kid._id}/points`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return { ...kid, points: pointsResponse.data.points };
          })
        );

        setKids(updatedKids);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch user data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

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
