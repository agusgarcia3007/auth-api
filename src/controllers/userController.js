const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const mailer = require("../utils/mailer");
const { check } = require("express-validator");

exports.createUser = async (req, res) => {
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
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User(req.body);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

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
    res.status(400).send("There was an error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send("There was an error");
  }
};

exports.sendEmail = async (req, res) => {
  try {
    // check email is valid
    const { email } = req.body;
    if (!email) res.status(400).json({ msg: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    check("email", "Please include a valid email").isEmail();

    // create a token
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.SECRET,
      {
        expiresIn: "20m",
      }
    );

    // send email
    const link = `${process.env.BASE_URL}/passwrod-reset/${user._id}/${token}`;
    await mailer(user.email, "Reset Password", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("an error occured");
    console.log(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded._id === user._id.toString()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.send("password successfully updated");
    } else {
      res.send("invalid token");
    }
  } catch (error) {
    res.send("an error occured");
    console.log(error);
  }
};
