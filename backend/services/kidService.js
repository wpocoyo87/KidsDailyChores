//kidService.js

import Kid from "../models/kidModel.js";

// Create a new kid
export const createKid = async (data) => {
  const { name, age, selectedAvatar } = data;

  const newKid = new Kid({
    name,
    age,
    selectedAvatar,
    tasks: [],
  });

  const savedKid = await newKid.save();
  return savedKid;
};

// Get all kids
export const getAllKids = async () => {
  const kids = await Kid.find();
  return kids;
};

// Get a single kid by ID
export const getKidById = async (id) => {
  const kid = await Kid.findById(id);
  return kid;
};

// Update a kid
export const updateKid = async (id, data) => {
  const { name, age, selectedAvatar } = data;

  const updatedKid = await Kid.findByIdAndUpdate(
    id,
    {
      name,
      age,
      selectedAvatar,
    },
    { new: true }
  );

  return updatedKid;
};

// Delete a kid
export const deleteKid = async (id) => {
  const deletedKid = await Kid.findByIdAndDelete(id);
  return deletedKid;
};

// Get tasks for a kid
export const getTasksForKid = async (id) => {
  const kid = await Kid.findById(id);
  return kid ? kid.tasks : null;
};

// Add a task to a kid
export const addTaskToKid = async (id, data) => {
  const { description, image, date } = data;

  const kid = await Kid.findById(id);
  if (kid) {
    kid.tasks.push({ description, image, date, completed: false });
    await kid.save();
  }

  return kid;
};

// Update a task for a kid
export const updateTaskForKid = async (id, taskId, data) => {
  const { description, image, date, completed } = data;

  const kid = await Kid.findById(id);
  if (kid) {
    const task = kid.tasks.id(taskId);
    if (task) {
      task.description = description;
      task.image = image;
      task.date = date;
      task.completed = completed;
      await kid.save();
    }
  }

  return kid;
};

// Delete a task for a kid
export const deleteTaskForKid = async (id, taskId) => {
  const kid = await Kid.findById(id);
  if (kid) {
    const task = kid.tasks.id(taskId);
    if (task) {
      task.remove();
      await kid.save();
    }
  }

  return kid;
};
