# Implementation Guide (Missing Requirements)

Based on the assignment image, here is the step-by-step manual process you need to follow to complete the remaining requirements for your project.

**Current Status Check against requirements:**
✅ Signup/Login API (Done)
✅ Password Hashing with bcrypt (Done)
✅ JWT Token generation/verification (Done)
✅ CORS setup (Done)
✅ Protected Routes (Done)
✅ Password validation & Email uniqueness (Done)
✅ **dotenv setup** (Done)
✅ **MongoDB Storage** (Done - Connected to MongoDB Atlas)
✅ **Logout Functionality** (Done)

---

## Step 1: Install Mongoose
You need to connect to MongoDB. The standard way to do this in Express is using `mongoose`.
1. Open your terminal in the `Login-signup-backend` folder.
2. Run: `npm install mongoose`

## Step 2: Setup `.env` Configuration
Your secrets shouldn't be hardcoded in the files. 
1. Create a new file named `.env` in the root folder (same level as `package.json`).
2. Add the following lines inside `.env`:
   ```env
   PORT=8888
   MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
   JWT_SECRET=acharya
   ```
   *(Replace the `MONGO_URI` with your actual MongoDB connection string from MongoDB Atlas or use `mongodb://127.0.0.1:27017/loginDB` for a local database).*
3. Open `index.js` and add this to the very top (line 1):
   ```javascript
   require('dotenv').config();
   ```

## Step 3: Connect to MongoDB
1. Open `index.js`.
2. Import mongoose at the top:
   ```javascript
   const mongoose = require('mongoose');
   ```
3. Below your middleware (`app.use...`), add the connection code:
   ```javascript
   mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("Connected to MongoDB successfully"))
     .catch((err) => console.log("Error connecting to MongoDB", err));
   ```

## Step 4: Create the User Database Model
1. Create a new folder named `Models` in your project.
2. Inside `Models`, create a file named `User.js`.
3. Add the following code to `User.js` to define your schema:
   ```javascript
   const mongoose = require('mongoose');

   const userSchema = new mongoose.Schema({
       email: { type: String, required: true, unique: true },
       password: { type: String, required: true }
   });

   module.exports = mongoose.model('User', userSchema);
   ```

## Step 5: Update `Controller/Api.js` to use MongoDB
Currently, you use `let arr = []`. You need to replace this with your new MongoDB model.
1. Open `Controller/Api.js`.
2. Delete `let arr = []`.
3. Import your model at the top:
   ```javascript
   const User = require('../Models/User');
   ```
4. Also, change `const secretKey = "acharya";` to use dotenv:
   ```javascript
   const secretKey = process.env.JWT_SECRET;
   ```
5. **Update Register function:** Make it `async` and save the user.
   ```javascript
   const register = async (req, res) => {
       const data = req.body;
       try {
           const existingUser = await User.findOne({ email: data.email });
           if (existingUser) return res.send({ msg: "This email already exists" });

           data.password = bcrypt.hashSync(data.password, saltRound);
           
           const newUser = new User(data);
           await newUser.save(); // Saves to MongoDB

           const token = jwt.sign({ user: data.email }, secretKey);
           res.send({ msg: "User Registered successfully", token: token });
       } catch (err) {
           res.send({ msg: "Server Error", error: err.message });
       }
   };
   ```
6. **Update Login function:** Use `User.findOne` instead of `arr.find`.
   *(You already have it set as `async`, just update the finding logic)*:
   ```javascript
   const account = await User.findOne({ email: data.email });
   ```

## Step 6: Update `Middleware/auth.js`
Open `Middleware/auth.js` and update your secret key to use the environment variable:
```javascript
const secretKey = process.env.JWT_SECRET;
```

## Step 7: Add Logout Functionality
JWTs are stateless. Standard practice for "logging out" with JWT is simply having the frontend delete the token from LocalStorage. 
However, to fulfill the API requirement, you can create a dummy logout endpoint.
1. In `Routes/UserRoutes.js`, add:
   ```javascript
   route.post("/logout", (req, res) => {
       res.send({ msg: "Logged out successfully. Please remove the token from your client." });
   });
   ```

## Step 8: Submission (Postman & GitHub)
1. **GitHub:** Create a repository on GitHub, run `git init`, add, commit, and push your code. *(Don't forget to create a `.gitignore` file and put `node_modules` and `.env` inside it before pushing!)*
2. **Postman:** In Postman, click on "Collections" on the left, create a new collection called "Auth API". Save your Register, Login, and Dashboard requests inside it. Click the three dots next to the collection name, select "Export", and save the `.json` file.
