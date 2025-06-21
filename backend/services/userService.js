import User from "../models/UserModel.js";
import Kid from "../models/KidModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/authConfig.js";

// Function to calculate age based on birth date
const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }
  return age;
};

// Service to register a new user
const registerUserService = async (userData) => {
  try {
    // Pastikan userData.email wujud sebelum guna toLowerCase()
    if (!userData.email) {
      throw new Error('Email is required');
    }
    
    const email = userData.email.toLowerCase();

    const newUser = new User({
      username: userData.username,
      email: email,
      password: userData.password,
      kids: [], // Pastikan kids dimulakan sebagai array kosong
    });

    await newUser.save();

    for (const kidData of userData.kids) {
      const age = calculateAge(kidData.birthDate);
      const kid = new Kid({
        name: kidData.name,
        birthDate: kidData.birthDate,
        gender: kidData.gender,
        selectedAvatar: kidData.selectedAvatar,
        age: age,
        parent: newUser._id,
      });

      const savedKid = await kid.save();
      newUser.kids.push(savedKid);
    }

    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

// Service to login a user
const loginUserService = async (email, password) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(user._id);

  return { user, token };
};

// Service to get user by email
const getUserByEmailService = async (email) => {
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Service to add a kid
const addKidService = async (userId, kidData) => {
  const { name, gender, birthDate, selectedAvatar } = kidData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const age = calculateAge(birthDate);
  const newKid = new Kid({
    name,
    gender,
    birthDate,
    selectedAvatar,
    age, // Tetapkan umur yang dikira
    parent: userId, // Tetapkan ID pengguna sebagai parent
    points: 0,
  });

  const savedKid = await newKid.save();
  user.kids.push(savedKid);
  await user.save();

  return savedKid;
};

export {
  registerUserService,
  loginUserService,
  getUserByEmailService,
  addKidService,
};
