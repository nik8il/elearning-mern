const express = require("express");
const router = express.Router();
const { getStats, getAllStudents, getAllResults } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, getStats);
router.get("/students", protect, adminOnly, getAllStudents);
router.get("/results", protect, adminOnly, getAllResults);

module.exports = router; 