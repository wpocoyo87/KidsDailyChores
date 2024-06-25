import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const InsertTask = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    getFormattedDate(new Date())
  ); // Initialize with current date

  // Function to fetch images from public/images/taskImages directory
  const fetchImages = () => {
    const images = [];
    const numImages = 18;
    for (let i = 1; i <= numImages; i++) {
      images.push(`/images/task${i}.png`);
    }
    return images;
  };

  // Function to format date as YYYY-MM-DD
  function getFormattedDate(date) {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchSelectedKid = async () => {
      try {
        // Assuming you have a token stored in localStorage
        const token = localStorage.getItem("token");

        // Fetch the selected kid's details from the backend
        const response = await axios.get(
          `http://localhost:5000/api/kids/${selectedKidId}`, // Adjust endpoint as per your backend
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update selectedKid state with fetched data
        setSelectedKid(response.data);
      } catch (error) {
        console.error("Error fetching selected kid:", error);
        // Handle error, e.g., redirect to login page or show error message
      }
    };

    // Fetch selected kid from localStorage on component mount
    const storedSelectedKid = JSON.parse(localStorage.getItem("selectedKid"));
    if (storedSelectedKid) {
      setSelectedKid(storedSelectedKid);

      // Call fetchSelectedKid to get the kid's avatar and name
      fetchSelectedKid();
    }
  }, []);

  const handleAddTask = () => {
    if (selectedKid) {
      const newTask = {
        kidId: selectedKid.id,
        description,
        image,
        date: selectedDate,
      };
      setTasks([...tasks, newTask]);
      setDescription("");
      setImage("");
      setSelectedImage(null);
      setSelectedDate(getFormattedDate(new Date())); // Reset date to current date after adding task
    }
  };

  const handleSaveTasks = () => {
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = [...existingTasks, ...tasks];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    router.push("/checkedTask");
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
  };

  const handleImageClick = (selectedImagePath) => {
    setImage(selectedImagePath);
    setSelectedImage(selectedImagePath);
  };

  const styles = {
    body: {
      fontFamily: "Comic Sans MS, cursive",
      backgroundColor: "#f0f0f0",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url("/images/bird.gif")`, // Background image URL
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    formContainer: {
      maxWidth: "600px",
      width: "100%",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white background
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    formInput: {
      width: "100%",
      marginBottom: "15px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
    },
    imageContainer: {
      marginBottom: "15px",
      textAlign: "center",
    },
    imageGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
      gap: "10px",
      marginBottom: "10px",
    },
    imageItem: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      cursor: "pointer",
      transition: "transform 0.2s ease-in-out",
    },
    selectedImage: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      border: "2px solid #007bff",
    },
    submitBtn: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "10px",
    },
    tasksList: {
      marginTop: "20px",
    },
    taskItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "10px",
      backgroundColor: "#f9f9f9",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
    },
    taskDetails: {
      display: "flex",
      alignItems: "center",
    },
    taskImage: {
      width: "40px",
      height: "40px",
      marginRight: "10px",
      borderRadius: "4px",
    },
    deleteButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "1.5rem",
    },
    kidInfoContainer: {
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
    },
    kidAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginRight: "10px",
    },
    kidName: {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        {selectedKid && (
          <div style={styles.kidInfoContainer}>
            <img
              src={selectedKid.selectedAvatar || "/images/default-avatar.png"} // Use default avatar if selectedAvatar is not available
              alt={`Avatar of ${selectedKid.name}`}
              style={styles.kidAvatar}
            />
            <div>
              <span style={styles.kidName}>{selectedKid.name}</span>
            </div>
          </div>
        )}
        <h1 style={{ textAlign: "center" }}>Insert Task</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.formInput}
          placeholder="Select Date"
          required
        />
        <div style={styles.imageContainer}>
          <label>Choose Image:</label>
          <div style={styles.imageGrid}>
            {fetchImages().map((imgPath, index) => (
              <img
                key={index}
                src={imgPath}
                alt={`Task ${index + 1}`}
                style={
                  selectedImage === imgPath
                    ? { ...styles.selectedImage, ...styles.imageItem }
                    : styles.imageItem
                }
                onClick={() => handleImageClick(imgPath)}
              />
            ))}
          </div>
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.formInput}
          placeholder="Task Description"
          required
        />
        <button onClick={handleAddTask} style={styles.submitBtn}>
          Add Task
        </button>
        <div style={styles.tasksList}>
          {tasks.map((task, index) => (
            <div key={index} style={styles.taskItem}>
              <div style={styles.taskDetails}>
                <img src={task.image} alt="Task" style={styles.taskImage} />
                <span>{task.description}</span> - <span>{task.date}</span>
              </div>
              <button
                onClick={() => handleDeleteTask(index)}
                style={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        {tasks.length > 0 && (
          <button onClick={handleSaveTasks} style={styles.submitBtn}>
            Save All Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default InsertTask;
