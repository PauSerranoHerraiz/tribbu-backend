const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/users/search", isAuthenticated, (req, res, next) => {
  const { email } = req.query;

  if (!email || email.length < 3) {
    return res.json([]);
  }

  User.find({
    email: { $regex: email, $options: "i" }
  })
    .select("_id name email")
    .limit(5) 
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