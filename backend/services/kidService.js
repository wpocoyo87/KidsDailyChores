import mongoose from "mongoose";
import Kid from "../models/KidModel.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const createKidService = async (userId, kidData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const newKid = new Kid({ ...kidData, parent: userId });
  await newKid.save();
  user.kids.push(newKid._id);
  await user.save();

  return newKid;
};

export const getKidByIdService = async (userId, kidId, userRole = 'parent') => {
  let kid;
  
  if (userRole === 'kid') {
    // Kids can only access their own data
    kid = await Kid.findOne({ _id: kidId, _id: userId }).select('-kidPin');
  } else {
    // Parents can access their kids' data
    kid = await Kid.findOne({ _id: kidId, parent: userId });
  }
  
  if (!kid) {
    throw new Error("Kid not found");
  }
  return kid;
};

export const updateKidPointsService = async (userId, kidId, points) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }

  kid.points = points;
  await kid.save();

  return kid;
};

export const getKidPointsService = async (kidId) => {
  try {
    const kid = await getKidWithAccuratePoints(kidId);
    return kid;
  } catch (error) {
    console.error("Error getting kid points:", error);
    throw new Error("Kid not found");
  }
};

export const addTasksService = async (userId, kidId, tasks) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }
  console.log(`Tasks to add: ${JSON.stringify(tasks)}`);
  kid.tasks = kid.tasks.concat(tasks);
  await kid.save();

  return kid;
};

export const getTasksService = async (kidId, date) => {
  try {
    console.log(`Getting tasks for kidId: ${kidId}, date: ${date}`);

    const targetDate = new Date(date);

    const kid = await Kid.findById(new mongoose.Types.ObjectId(kidId));
    if (!kid) {
      throw new Error("Kid not found");
    }

    const tasks = kid.tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return (
        taskDate.toISOString().slice(0, 10) ===
        targetDate.toISOString().slice(0, 10)
      );
    });

    console.log(`Tasks found: ${tasks.length}`);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Error fetching tasks");
  }
};

export const deleteTaskService = async (userId, kidId, taskId) => {
  const kid = await Kid.findOne({ _id: kidId, parent: userId });
  if (!kid) {
    throw new Error("Kid not found");
  }

  kid.tasks = kid.tasks.filter((task) => task._id.toString() !== taskId);

  await kid.save();
  return kid;
};

export const updateTaskCompletionService = async (
  userId,
  kidId,
  taskId,
  completed,
  userRole = 'parent'
) => {
  try {
    let kid;
    
    if (userRole === 'kid') {
      // Kids can only update their own tasks
      kid = await Kid.findOne({ _id: kidId, _id: userId });
    } else {
      // Parents can update their kids' tasks
      kid = await Kid.findOne({ _id: kidId, parent: userId });
    }
    
    if (!kid) {
      throw new Error("Kid not found");
    }

    const task = kid.tasks.id(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.completed = completed;

    // Automatically calculate total points based on all completed tasks
    const totalCompletedTasks = kid.tasks.filter((t) => t.completed).length;
    kid.points = totalCompletedTasks;

    await kid.save();

    return { task, kid };
  } catch (error) {
    console.error("Error updating task completion:", error);
    throw new Error("Error updating task completion");
  }
};

export const addKidService = async (userId, kidData) => {
  const { name, gender, birthDate, selectedAvatar } = kidData;

  const user = await User.findById(userId);
  console.log(`User found: ${user}`);

  if (!user) {
    throw new Error("User not found");
  }

  const newKid = {
    name,
    gender,
    birthDate,
    selectedAvatar,
    points: 0,
  };

  user.kids.push(newKid);
  await user.save();

  return newKid;
};

// Function to recalculate points for all kids (useful for fixing existing data)
export const recalculateAllKidsPoints = async () => {
  try {
    const allKids = await Kid.find({});

    for (const kid of allKids) {
      const totalCompletedTasks = kid.tasks.filter((t) => t.completed).length;
      kid.points = totalCompletedTasks;
      await kid.save();
      console.log(
        `Updated points for ${kid.name}: ${totalCompletedTasks} stars`
      );
    }

    console.log(`Recalculated points for ${allKids.length} kids`);
    return allKids.length;
  } catch (error) {
    console.error("Error recalculating points:", error);
    throw new Error("Error recalculating points");
  }
};

// Function to get kid with accurate points calculation
export const getKidWithAccuratePoints = async (kidId) => {
  try {
    const kid = await Kid.findById(kidId);
    if (!kid) {
      throw new Error("Kid not found");
    }

    // Recalculate points to ensure accuracy
    const totalCompletedTasks = kid.tasks.filter((t) => t.completed).length;
    if (kid.points !== totalCompletedTasks) {
      kid.points = totalCompletedTasks;
      await kid.save();
      console.log(`Fixed points for ${kid.name}: ${totalCompletedTasks} stars`);
    }

    return kid;
  } catch (error) {
    console.error("Error getting kid with accurate points:", error);
    throw new Error("Error getting kid with accurate points");
  }
};

// Kids Authentication Services
export const setKidPinService = async (userId, kidId, pin) => {
  try {
    const kid = await Kid.findOne({ _id: kidId, parent: userId });
    if (!kid) {
      throw new Error("Kid not found");
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      throw new Error("PIN must be exactly 4 digits");
    }

    await kid.setKidPin(pin);
    await kid.save();

    return { success: true, message: "PIN set successfully" };
  } catch (error) {
    console.error("Error setting kid PIN:", error);
    throw new Error(error.message || "Error setting PIN");
  }
};

export const kidLoginService = async (kidId, pin) => {
  try {
    const kid = await Kid.findById(kidId);
    if (!kid || !kid.isActive) {
      throw new Error("Kid not found or inactive");
    }

    // Check if account is locked
    if (kid.isLocked()) {
      throw new Error("Account temporarily locked due to too many failed attempts");
    }

    // Check if PIN is set
    if (!kid.kidPin) {
      throw new Error("PIN not set for this kid");
    }

    // Verify PIN
    const isMatch = await kid.matchKidPin(pin);
    if (!isMatch) {
      await kid.incLoginAttempts();
      throw new Error("Invalid PIN");
    }

    // Reset login attempts on successful login
    await kid.resetLoginAttempts();
    
    // Update last login
    kid.lastLogin = new Date();
    await kid.save();

    // Generate kid token (different from parent token)
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    const kidToken = jwt.sign(
      { 
        id: kid._id, 
        name: kid.name,
        role: 'kid',
        parentId: kid.parent 
      }, 
      JWT_SECRET, 
      { expiresIn: "4h" } // Shorter session for kids
    );

    return { 
      success: true, 
      kid: {
        _id: kid._id,
        name: kid.name,
        selectedAvatar: kid.selectedAvatar,
        points: kid.points,
        age: kid.age,
        gender: kid.gender,
        role: 'kid'
      },
      token: kidToken 
    };
  } catch (error) {
    console.error("Error in kid login:", error);
    throw new Error(error.message || "Login failed");
  }
};

export const removeKidPinService = async (userId, kidId) => {
  try {
    const kid = await Kid.findOne({ _id: kidId, parent: userId });
    if (!kid) {
      throw new Error("Kid not found");
    }

    kid.kidPin = null;
    kid.loginAttempts = 0;
    kid.lockedUntil = null;
    await kid.save();

    return { success: true, message: "PIN removed successfully" };
  } catch (error) {
    console.error("Error removing kid PIN:", error);
    throw new Error("Error removing PIN");
  }
};

// Function to get kids by parent email (for kids login)
export const getKidsByParentEmailService = async (parentEmail) => {
  try {
    // First find the parent user by email
    const parentUser = await User.findOne({ email: parentEmail }).select('_id');
    if (!parentUser) {
      throw new Error("Parent not found");
    }

    // Then find all kids for this parent
    const kids = await Kid.find({ parent: parentUser._id })
      .select('_id name selectedAvatar age gender kidPin')
      .lean();

    // Only return kids that have PIN set
    const kidsWithPin = kids.filter(kid => kid.kidPin);

    // Remove PIN from response for security
    const safeKidsData = kidsWithPin.map(kid => ({
      _id: kid._id,
      name: kid.name,
      selectedAvatar: kid.selectedAvatar,
      age: kid.age,
      gender: kid.gender,
      hasPinSet: !!kid.kidPin
    }));

    return safeKidsData;
  } catch (error) {
    console.error("Error getting kids by parent email:", error);
    throw new Error(error.message || "Error getting kids data");
  }
};
