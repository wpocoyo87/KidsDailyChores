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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
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

        setUser(response.data);
        setKids(response.data.kids || []); // Ensure kids array is properly set
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch user data. Please try again."
        ); // Set error message
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchUserData();
  }, [router]);

  const handleSelection = (kid) => {
    setSelectedKid(kid);
    localStorage.setItem("selectedKid", JSON.stringify(kid));
    router.push("/main"); // Redirect to the main page after selecting a kid
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
        <h1 style={styles.title}>Select a Kid</h1>
        {user && (
          <div>
            <p>Hi {user.username}, Choose your Kid!</p>
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
    backgroundImage: "url(/images/background.jpg)",
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
