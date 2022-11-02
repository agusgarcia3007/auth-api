const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.authUser = async (req, res) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract email and password
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check password
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Create and sign JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600, // 1 hour
      },
      (error, token) => {
        if (error) throw error;

        // Confirmation message
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
