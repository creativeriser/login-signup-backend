# Full Stack App Setup Notes

This document contains step-by-step instructions for setting up the database and deploying the application. We will update this as we progress through building the frontend and deploying to Vercel.

## 1. MongoDB Atlas Setup (Cloud Database)

Instead of using a local MongoDB database (which only lives on your computer), we use MongoDB Atlas so that our deployed server on Vercel can access the database over the internet.

### Step 1: Create a Database
1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a new Project (e.g., "My-App").
3. Click **Build a Database** and select the **M0 Free** tier.
4. Leave the provider as AWS and region as the closest to you (e.g., Mumbai ap-south-1).
5. Click **Create Deployment**.

### Step 2: Set up Database Credentials & Security
1. After the cluster is created, you will be prompted to create a database user.
2. Enter a **Username** (e.g., `admin`).
3. Click **Autogenerate Secure Password** and copy it somewhere safe.
4. Click **Create User**.
5. Under "Where would you like to connect from?", select **My Local Environment**. 
6. Click **Add My Current IP Address** (this allows your computer to talk to the database).
7. Click **Finish and Close**.

### Step 3: Get your MONGO_URI
1. Go to your Database dashboard in Atlas.
2. Click **Connect** next to your cluster.
3. Choose **Drivers** (Access your Atlas data using MongoDB's native drivers).
4. Copy the connection string provided (it looks like `mongodb+srv://admin:<password>@cluster0...`).

### Step 4: Configure Environment Variables
1. Create a `.env` file in the root of your project.
2. Add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_copied_string_goes_here
   JWT_SECRET=your_super_secret_key_for_tokens
   ```
3. **Important:** Replace `<password>` in your `MONGO_URI` with the actual password you copied earlier (remove the `< >` brackets).

---

### Step 5: Create Database Connection Code
1. Create a new folder named `Database` in the root of your project.
2. Inside `Database`, create a file named `db.js`.
3. Add the following code to `db.js`:
   ```javascript
   const mongoose = require('mongoose');

   const connectDB = async () => {
       try {
           // This connects to the MONGO_URI in your .env file
           await mongoose.connect(process.env.MONGO_URI);
           console.log("MongoDB Database Connected Successfully! 🎉");
       } catch (error) {
           console.error("MongoDB Connection Failed ❌", error);
           process.exit(1);
       }
   };

   module.exports = connectDB;
   ```

### Step 6: Initialize Connection in Main File
1. Open your main entry point file (`index.js`).
2. Add the `.env` configuration and the database connection at the very top of the file:
   ```javascript
   require('dotenv').config();
   const connectDB = require('./Database/db');
   
   connectDB();
   ```
3. Run your server using `npm run dev` and look for the success message in the console!

---

## 2. Authentication API Implementation

After setting up the database connection, we implemented a full, secure Authentication API using JSON Web Tokens (JWT) and `bcrypt` for password hashing.

### Step 1: Create the User Model
1. Create a `Models` folder.
2. Inside `Models`, create `User.js` to define the schema (how data looks in the database):
   ```javascript
   const mongoose = require('mongoose');

   const userSchema = new mongoose.Schema({
       email: { type: String, required: true, unique: true },
       password: { type: String, required: true }
   }, { timestamps: true });

   const User = mongoose.model('User', userSchema);
   module.exports = User;
   ```

### Step 2: Update Auth Middleware (JWT Verification)
1. Inside `Middleware/auth.js`, safely verify the token and use the `.env` secret key:
   ```javascript
   const jwt  = require('jsonwebtoken')
   const auth  = (req,res,next)=>{
       const data = req.headers["authorization"]
       if(data){
           const token = data.split(' ')[1]
           if(token){
               jwt.verify(token, process.env.JWT_SECRET, (err,validate)=>{
                   if(err) return res.send("Error while accessing", err)
                   if(validate) return next()
                   return res.send("user is not authorized")
               })
           } else {
               return res.send({msg:"Email id is not registered"})
           }
       } else {
           return res.send({msg:"Token is missing"})
       }
   }
   module.exports = auth
   ```

### Step 3: Update Controller Logic
1. Inside `Controller/Api.js`, connect the logic to the `User` database model instead of an array.
2. Use `bcrypt.hashSync` to encrypt passwords on signup (`register`).
3. Use `bcrypt.compare` to check passwords on login (`login`).
4. Generate the token with `jwt.sign` and `process.env.JWT_SECRET`.
5. Add a `logout` function (which just sends a success message for the frontend to clear the token).

### Step 4: Update Routes
1. In `Routes/UserRoutes.js`, import the new `logout` controller.
2. Add the route: `route.post('/logout', logout)`.

### Step 5: Testing with Postman
1. **Signup**: `POST /pages/register` with JSON body `{"email": "...", "password": "..."}`.
2. **Login**: `POST /pages/login` with the same body to receive your `token`.
3. **Protected Route**: `GET /pages/dashboard` with a header `Authorization: Bearer <your_token>`.

---
*Next up: We will document the Vercel backend deployment steps here once we reach that stage.*
