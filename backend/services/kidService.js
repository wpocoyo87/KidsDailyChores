// backend/services/kidService.js

const Kid = require("../models/kidModel");

async function getAllKids() {
  return await Kid.find();
}

async function getKidById(id) {
  return await Kid.findById(id);
}

async function createKid(data) {
  const kid = new Kid(data);
  return await kid.save();
}

async function updateKid(id, data) {
  return await Kid.findByIdAndUpdate(id, data, { new: true });
}

async function deleteKid(id) {
  return await Kid.findByIdAndDelete(id);
}

module.exports = {
  getAllKids,
  getKidById,
  createKid,
  updateKid,
  deleteKid,
};
