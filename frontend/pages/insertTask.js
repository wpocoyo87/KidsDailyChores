import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InsertTask = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [storedSelectedKid, setStoredSelectedKid] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setStoredSelectedKid(localStorage.getItem("selectedKid"));
      if (storedSelectedKid) {
        try {
          const parsedSelectedKid = JSON.parse(storedSelectedKid);
          setSelectedKid(parsedSelectedKid);
          const genderValue =
            parsedSelectedKid.gender === "female" ? "Girl" : "Boy";
          setGender(genderValue);
          console.log("Gender of kid:", parsedSelectedKid.gender);
        } catch (error) {
          console.error("Error parsing selectedKid from localStorage", error);
        }
      }
    }
  }, []);

  const fetchImages = (gender) => {
    const images = [];
    const numImages = 12;
    for (let i = 1; i <= numImages; i++) {
      images.push(`/images/${gender}Task${i}.jpeg`);
    }
    console.log("Fetched images for gender:", gender, images);
    return images;
  };

  const handleAddTask = () => {
    if (selectedKid) {
      const newTask = {
        kidId: selectedKid._id,
        description,
        image,
        date: selectedDate.toISOString().split("T")[0],
      };
      setTasks([...tasks, newTask]);
      setDescription("");
      setImage("");
      setSelectedImage(null);
      setSelectedDate(new Date());
    }
  };

  const handleSaveTasks = async () => {
    try {
      if (!selectedKid) {
        console.error("No kid selected to save tasks for");
        return;
      }

      if (!tasks.length) {
        console.error("No tasks to save");
        return;
      }

      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const tasksToSave = tasks.map((task) => ({
        description: task.description,
        image: task.image,
        date: task.date,
      }));

      const response = await axios.post(
        `http://localhost:5000/api/kids/${selectedKid._id}/tasks`,
        { tasks: tasksToSave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Tasks saved successfully:", response.data);
      router.push("/listTask");
    } catch (error) {
      console.error("Error saving tasks:", error);
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        console.error("Server response data:", error.response.data);
      }
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleImageClick = (imgPath) => {
    setSelectedImage(imgPath);
    setImage(imgPath);
  };

  const handleHomeClick = () => {
    router.push("/choosekids");
  };

  const handleSeeCurrentTasks = () => {
    router.push("/listTask");
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>Insert Task for {selectedKid ? selectedKid.name : "Loading..."}</h1>
        {selectedKid && (
          <img
            src={selectedKid.selectedAvatar}
            alt="Kid Avatar"
            style={styles.kidAvatar}
          />
        )}
        <div style={styles.datePickerContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            style={styles.datePicker}
          />
        </div>
        <div style={styles.imageContainer}>
          <label>Choose Image:</label>
          <div style={styles.imageGrid}>
            {selectedKid &&
              fetchImages(gender).map((imgPath, index) => (
                <img
                  key={index}
                  src={imgPath}
                  alt={`Task ${index + 1}`}
                  style={{
                    ...styles.imageItem,
                    ...(selectedImage === imgPath ? styles.selectedImage : {}),
                  }}
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
        <button onClick={handleAddTask} style={styles.addButton}>
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
          <button onClick={handleSaveTasks} style={styles.addButton}>
            Save All Tasks
          </button>
        )}
        <button onClick={handleSeeCurrentTasks} style={styles.seeTasksBtn}>
          See Current Task
        </button>
        <button onClick={handleHomeClick} style={styles.homeBtn}>
          HOME
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
  container: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  formInput: {
    fontFamily: "Comic Sans MS, cursive",
    margin: "8px 0",
    padding: "6px",
    width: "96%",
    border: "1px dashed orange",
    borderRadius: "8px",
    backgroundColor: "#e3f2fd",
    color: "#0d47a1",
    fontSize: "16px",
  },
  addButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "15px",
    fontFamily: "Comic Sans MS, cursive",
  },
  seeTasksBtn: {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "16px",
    fontFamily: "Comic Sans MS, cursive",
  },
  homeBtn: {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#ffcc00",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
    fontSize: "16px",
    fontFamily: "Comic Sans MS, cursive",
  },
  datePickerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  datePicker: {
    padding: "10px",
    border: "1px dashed orange",
    borderRadius: "8px",
    backgroundColor: "#e3f2fd",
    color: "#0d47a1",
    textAlign: "center",
    fontFamily: "Comic Sans MS, cursive",
  },
  imageContainer: {
    margin: "6px 0",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",
    transition: "border-color 0.3s ease",
  },
  selectedImage: {
    borderColor: "red",
    animation: "shining 1.5s infinite alternate",
  },
  tasksList: {
    margin: "20px 0",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    justifyContent: "center",
    alignItems: "center",
  },
  taskDetails: {
    display: "flex",
    alignItems: "center",
  },
  taskImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    cursor: "pointer",
    borderRadius: "8px",
    padding: "5px",
    backgroundColor: "transparent",
    border: "none",
  },
  kidAvatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "20px",
  },
};

export default InsertTask;
