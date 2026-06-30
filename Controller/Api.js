const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");

// 1. Import your new User Model from Step 1!
const User = require("../Models/User");

// (We deleted let arr = []; because we are using the real MongoDB Database now!)

const register = async (req, res) => {
  const data = req.body; //body parsing

  try {
    // 2. Check if user already exists in the real database
    const account = await User.findOne({ email: data.email });
    if (account) {
      return res.status(409).send({ msg: "This email is already exist" });
    }

    // encrypt the password by hashing the password
    data.password = bcrypt.hashSync(data.password, saltRound);

    // 3. Save to database instead of pushing to an array
    const newUser = await User.create(data);

    // jwt token generation using your .env secret
    const token = jwt.sign({ user: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "365d"
    });

    res.status(201).send({ msg: "user Registered successfully", token: token });
  } catch (error) {
    res.status(500).send({ msg: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  const data = req.body; //user input data for login

  try {
    // 4. Find user in the real database
    const account = await User.findOne({ email: data.email });

    if (account) {
      const login = await bcrypt.compare(data.password, account.password);
      if (login) {
        // Use .env secret here too
        const token = jwt.sign({ user: data.email }, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });
        return res.status(200).send({ msg: "User Logged in successfully", token: token });
      } else {
        return res.status(401).send({ msg: "Password is incorrect" });
      }
    } else {
      return res.status(404).send({ msg: "User is not registered" });
    }
  } catch (error) {
    return res.status(500).send({ msg: "Error logging in", error: error.message });
  }
};

// 5. Add logout functionality as required by teacher
const logout = (req, res) => {
  // For JWT authentication, the frontend is actually responsible for deleting the token.
  // The backend just sends a success message back telling the frontend to do so!
  res.send({ msg: "User Logged out successfully." });
};

const home = (req, res) => {
  res.send({
    message: "This is Home page",
  });
};

const dashboard = (req, res) => {
  res.send({ msg: "Welcome to Dashboard" });
};

// Don't forget to export the new logout function!
module.exports = { login, register, logout, home, dashboard };
