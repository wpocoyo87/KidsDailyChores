import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InsertTask = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [storedSelectedKid, setStoredSelectedKid] = useState(null);
  const [selectedKid, setSelectedKid] = useState(null);
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      const tokenValue = localStorage.getItem("token");
      const kidValue = localStorage.getItem("selectedKid");
      setToken(tokenValue);
      setStoredSelectedKid(kidValue);
      if (kidValue) {
        try {
          const parsedSelectedKid = JSON.parse(kidValue);
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

  if (!isClient || !token || !selectedKid) {
    return <div>Loading...</div>;
  }

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

const styles = { /* ... existing styles ... */ };

export default InsertTask; 