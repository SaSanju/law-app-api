const router = require("express").Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    // Check email
    const oldUser = await User.findOne({ email });
    oldUser && res.status(200).json(oldUser);

    // Create user
    const newUser = new User({
      username: email,
      email
    });

    // Save user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check email
    const user = await User.findOne({ email });
    !user && res.status(404).json("User not found");

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("Wrong password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
