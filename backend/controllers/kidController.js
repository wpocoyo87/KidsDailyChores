//backend/controller/kidController.js
import Kid from "../models/kidModel.js";

export const createKid = async (req, res) => {
  const { name, age, selectedAvatar } = req.body;

  try {
    const newKid = new Kid({
      name,
      age,
      selectedAvatar,
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
  const { name, age, selectedAvatar } = req.body;

  try {
    const updatedKid = await Kid.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        selectedAvatar,
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
    const kid = await Kid.findById(req.params.id);
    if (kid) {
      res.status(200).json(kid.tasks);
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTaskToKid = async (req, res) => {
  const { description, image, date } = req.body;

  try {
    const kid = await Kid.findById(req.params.id);
    if (kid) {
      kid.tasks.push({ description, image, date, completed: false });
      await kid.save();
      res.status(200).json(kid);
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskForKid = async (req, res) => {
  const { taskId, description, image, date, completed } = req.body;

  try {
    const kid = await Kid.findById(req.params.id);
    if (kid) {
      const task = kid.tasks.id(taskId);
      if (task) {
        task.description = description;
        task.image = image;
        task.date = date;
        task.completed = completed;
        await kid.save();
        res.status(200).json(kid);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTaskForKid = async (req, res) => {
  const { taskId } = req.params;

  try {
    const kid = await Kid.findById(req.params.id);
    if (kid) {
      const task = kid.tasks.id(taskId);
      if (task) {
        task.remove();
        await kid.save();
        res.status(200).json(kid);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createKid,
  getAllKids,
  getKidById,
  updateKid,
  deleteKid,
  getTasksForKid,
  addTaskToKid,
  updateTaskForKid,
  deleteTaskForKid,
};
