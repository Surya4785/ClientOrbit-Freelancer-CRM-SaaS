const express = require("express");
const router = express.Router();

const {
  getClients,
  createClient,
  deleteClient,
  updateClient
} = require("../controllers/clientController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getClients);
router.post("/", protect, createClient);
router.put("/:id", protect, updateClient);
router.delete("/:id", protect, deleteClient);

module.exports = router;