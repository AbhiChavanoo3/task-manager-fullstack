const express = require("express");
const Task = require("../models/Task");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= ADD TASK ================= */
router.post("/", verifyToken, async (req, res) => {
  try {

    if (!req.body.text)
      return res.status(400).json({ message: "Task text required" });

    const task = new Task({
      userId: req.user.id,   // 🔥 FIX HERE
      text: req.body.text
    });

    await task.save();

    res.json({ message: "Task added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET TASKS ================= */
router.get("/", verifyToken, async (req, res) => {
  try {

    const tasks = await Task.find({ userId: req.user.id });  // 🔥 FIX

    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE TASK ================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {

    await Task.deleteOne({
      _id: req.params.id,
      userId: req.user.id   // 🔥 FIX
    });

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
