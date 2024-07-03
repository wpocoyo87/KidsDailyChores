const TaskList = ({ tasks }) => {
  return (
    <ul style={styles.taskList}>
      {tasks.map((task) => (
        <li key={task.id} style={styles.taskItem}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleComplete(task.id)}
            style={styles.taskCheckbox}
          />
          <span style={styles.taskTitle}>{task.title}</span>
          {task.completed && <span style={styles.star}>★</span>}
        </li>
      ))}
    </ul>
  );
};

// CSS styles defined as JavaScript objects
const styles = {
  taskList: {
    width: "100%",
    maxWidth: "400px",
    listStyleType: "none",
    padding: "0",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    marginBottom: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  taskCheckbox: {
    marginRight: "10px",
  },
  taskTitle: {
    flex: "1",
    fontSize: "16px",
    fontWeight: "bold",
  },
  star: {
    fontSize: "24px",
    color: "#f4c30a",
  },
};

export default TaskList;
