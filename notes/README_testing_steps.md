# Backend Testing & Running Steps

This guide contains the instructions to run your current backend code and test it manually using tools like Postman.

## 1. How to run the project
To run this backend and see it working, follow these steps in your terminal:

1. **Navigate to the project folder:** Make sure your terminal is opened inside the `Login-signup-backend` folder.
2. **Install dependencies:** If you haven't already, install the required packages by running:
   ```bash
   npm install
   ```
3. **Start the server:** Start the server by running:
   ```bash
   npm run dev
   ```
   You should see `Server is running fine at 8888` printed in your terminal.

---

## 2. How to test the endpoints

Use **Postman**, **Insomnia**, or **Thunder Client** to test the API.

### Step 1: Verify the server is running
* **Method:** `GET`
* **URL:** `http://localhost:8888/`
* **Expected Output:** Returns `"Backend is working "`

### Step 2: Register a new user
* **Method:** `POST`
* **URL:** `http://localhost:8888/pages/register`
* **Headers:** `Content-Type: application/json`
* **Body (JSON format):**
  ```json
  {
    "email": "testuser@gmail.com",
    "password": "mysecretpassword"
  }
  ```
* **Expected Output:** You will receive a success message and a JWT token.

### Step 3: Test the Login
* **Method:** `POST`
* **URL:** `http://localhost:8888/pages/login`
* **Headers:** `Content-Type: application/json`
* **Body (JSON format):**
  ```json
  {
    "email": "testuser@gmail.com",
    "password": "mysecretpassword"
  }
  ```
* **Expected Output:** `"User Logged in successfully"` along with a new JWT token. **Copy this token** for the next step.

### Step 4: Access the Protected Dashboard Route
* **Method:** `GET`
* **URL:** `http://localhost:8888/pages/dashboard`
* **Headers:** 
  * Key: `Authorization`
  * Value: `Bearer <paste_the_copied_token_here>` 
* **Expected Output:** `{"msg":"Welcome to Dashboard"}`.

*Note: We have successfully connected this backend to a live MongoDB Atlas cloud database.*

### Postman Troubleshooting & Common Errors
**1. "Cannot POST /pages/register%0A" (404 Error)**
- **Why it happens:** `%0A` is a newline character. This happens if you accidentally paste an "enter" space at the very end of your URL in Postman.
- **How to fix:** Click at the very end of your URL in Postman and hit the backspace/delete key to ensure there are no hidden spaces after the word `register`.

**2. "Token is missing" on Dashboard**
- **Why it happens:** The `/pages/dashboard` route is protected by `auth.js`. You cannot access it without a JWT token.
- **How to fix:** You must hit the `/pages/login` route first to generate a token, copy that token, and provide it in the **Headers** tab of the dashboard request (as shown in Step 4 above).

---

## 3. Viewing Live Data in MongoDB Atlas

Once you have successfully registered a user using Postman, you can visually verify that the data was saved to your real cloud database by following these steps:

1. Log into the **[MongoDB Atlas website](https://cloud.mongodb.com)**.
2. On your main dashboard, locate your cluster (e.g., **Cluster0**) and click the **Browse Collections** button.
3. In the left panel, you will see your database (usually named `test` by default if you didn't specify one).
4. Click on the `users` collection inside the `test` database (Mongoose automatically makes your `User` model lowercase and plural).
5. You will see the actual JSON data of the user you just registered!
6. **Notice the Password:** Look at the `password` field in the database. Instead of seeing the actual password you typed in Postman, you will see a hashed string starting with `$2b$10$...`. This proves your `bcrypt` hashing is working successfully!
