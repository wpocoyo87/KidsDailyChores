const Kid = require("../models/kidModel");
const kidService = require("../services/kidService");

async function getAllKids(req, res) {
  try {
    const kids = await kidService.getAllKids();
    res.status(200).json(kids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getKidById(req, res) {
  const { id } = req.params;
  try {
    const kid = await kidService.getKidById(id);
    if (kid) {
      res.status(200).json(kid);
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createKid(req, res) {
  const { name, avatar, age } = req.body;
  const data = { name, avatar, age, userId: req.user.id }; // Assuming userId is set in req.user from middleware
  try {
    const newKid = await kidService.createKid(data);
    res.status(201).json(newKid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateKid(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedKid = await kidService.updateKid(id, data);
    if (updatedKid) {
      res.status(200).json(updatedKid);
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteKid(req, res) {
  const { id } = req.params;
  try {
    const deletedKid = await kidService.deleteKid(id);
    if (deletedKid) {
      res.status(200).json({ message: "Kid deleted successfully" });
    } else {
      res.status(404).json({ message: "Kid not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllKids,
  getKidById,
  createKid,
  updateKid,
  deleteKid,
};
