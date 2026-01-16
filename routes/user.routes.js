const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/users/search", (req, res, next) => {
  const { query } = req.query;
  User.find({
    $or: [
      { email: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } }
    ]
  })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log("Error searching users", err);
      res.status(500).json({ error: "Error searching users" });
    });
});

router.get("/users", (req, res, next) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => {
      console.log("Error fetching users", err);
      res.status(500).json({ error: "Error fetching users" });
    });
});

module.exports = router;