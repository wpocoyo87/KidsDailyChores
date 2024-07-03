import Kid from "../models/kidModel.js";
import Task from "../models/TaskModel.js";

export const createKid = async (req, res) => {
  const { name, age, selectedAvatar, birthDate } = req.body;

  try {
    const newKid = new Kid({
      name,
      age,
      selectedAvatar,
      birthDate,
      tasks: [],
    });

    const savedKid = await newKid.save();

    res.status(201).json(savedKid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllKids = async (req, res) => {
  try {
    const kids = await Kid.find();
    res.status(200).json(kids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getKidById = async (req, res) => {
  try {
    const kid = await Kid.findById(req.params.id);
    if (kid) {
      res.status(200).json(kid);
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateKid = async (req, res) => {
  const { name, age, selectedAvatar, birthDate } = req.body;

  try {
    const updatedKid = await Kid.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        selectedAvatar,
        birthDate,
      },
      { new: true }
    );

    if (updatedKid) {
      res.status(200).json(updatedKid);
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteKid = async (req, res) => {
  try {
    const deletedKid = await Kid.findByIdAndDelete(req.params.id);
    if (deletedKid) {
      res.status(200).json({ message: "Kid deleted successfully" });
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksForKid = async (req, res) => {
  try {
    const userId = req.userId; // Dapatkan userId dari req setelah verifikasi token
    const kid = await Kid.findOne({ _id: req.params.kidId, user: userId }); // Mencari kid berdasarkan ID dan user ID

    if (kid) {
      res.status(200).json(kid.tasks);
    } else {
      res.status(404).json({ message: "Kid not found for this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addTaskToKid = async (req, res) => {
  const { kidId } = req.params;
  const { description, image, date } = req.body;

  try {
    const kid = await Kid.findById(kidId);
    if (!kid) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const newTask = {
      description,
      image,
      date,
    };

    kid.tasks.push(newTask);
    await kid.save();

    res.status(201).json({ message: "Task added successfully", newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateTaskForKid = async (req, res) => {
  const { kidId, taskId } = req.params;
  const { description, image, date, completed } = req.body;

  try {
    const kid = await Kid.findById(kidId);
    if (!kid) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const task = kid.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.description = description;
    task.image = image;
    task.date = date;
    task.completed = completed;

    await kid.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteTaskForKid = async (req, res) => {
  const { kidId, taskId } = req.params;

  try {
    const kid = await Kid.findById(kidId);
    if (!kid) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const task = kid.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.remove();
    await kid.save();

    res.status(200).json(kid.tasks); // Return updated tasks after deletion
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
