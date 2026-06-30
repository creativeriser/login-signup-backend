# Login-Signup Backend API

This repository contains the backend code for a complete Authentication system built with Node.js, Express, MongoDB, and JSON Web Tokens (JWT).

## Features
- **User Registration:** Securely hashes passwords using `bcrypt` and stores users in MongoDB. Validates unique emails.
- **User Login:** Verifies credentials against MongoDB and issues a signed JWT token (expires in 365 days).
- **Protected Routes:** Middleware to protect routes (like `/dashboard`) and verify JWT headers.
- **Logout:** Clears session data/token.

## Tech Stack
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT (jsonwebtoken)**
- **Bcrypt**
- **dotenv & CORS**

## Postman API Testing Screenshots

*(Place your exported postman collection or screenshots in the `screenshots/` directory, and they will be visible here!)*

### Registration Test
![Registration](screenshots/register.png)

### Login Test
![Login](screenshots/login.png)

### Protected Route Test
![Dashboard](screenshots/dashboard.png)

---

*This project is completely deployment-ready and environment-configured.*
