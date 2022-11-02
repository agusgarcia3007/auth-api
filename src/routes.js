const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("./controllers/userController");
const authController = require("./controllers/authController");
const auth = require("./middlewares/authMiddleware");

router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userController.createUser
);
router.post("/login", authController.authUser);
router.get("/users", auth, userController.getUsers);
router.get("/user/:id", auth, userController.getUser);

router.post("/password-reset", userController.sendEmail);
router.post("/password-reset/:id/:token", userController.resetPassword);
module.exports = router;
