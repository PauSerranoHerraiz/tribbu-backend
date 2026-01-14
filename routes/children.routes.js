const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Child = require("../models/Child.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { checkChildRole } = require("../middleware/auth.middleware");

router.post("/children", isAuthenticated, checkChildRole(["GUARDIÁN"]), (req, res, next) => {

  Child.create(req.body)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating a child", err);
      res.status(500).json({ error: "Error while creating a child" });
    });
});

router.get("/children", isAuthenticated, (req, res, next) => {
  Child.find()
    .populate("User")
    .then((allChildren) => res.json(allChildren))
    .catch((err) => {
      console.log("Error while getting the child", err);
      res.status(500).json({ error: "Error while getting the child" });
    });
});

router.get("/children/:childId", isAuthenticated, (req, res, next) => {
  const { childId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(childId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Child.findById(childId)
    .then((child) => res.status(200).json(child))
    .catch((err) => {
      console.log("Error while retrieving a child", err);
      res.status(500).json({ error: "Error while retrieving a child" });
    });
});

router.put("/children/:childId", isAuthenticated, checkChildRole(["GUARDIÁN"]), (req, res, next) => {
  const { childId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(childId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Child.findByIdAndUpdate(childId, req.body, { new: true })
    .then((updatedChild) => res.json(updatedChild))
    .catch((err) => {
      console.log("Error while updating a child", err);
      res.status(500).json({ error: "Error while updating a child" });
    });
});

router.delete("/children/:childId", isAuthenticated, checkChildRole(["GUARDIÁN"]), (req, res, next) => {
  const { childId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(childId)) {
    return res.status(400).json({ error: "Specified id is not valid" });
    ;
  }

  Child.findByIdAndDelete(childId)
    .then(() =>
      res.json({
        message: `Child with ${childId} is removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("Error while deleting a child", err);
      res.status(500).json({ error: "Error while deleting a child" });
    });
});

module.exports = router;
