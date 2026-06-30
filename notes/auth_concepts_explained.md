# Authentication Concepts Explained

This document explains the core logic and security concepts implemented in this backend, exactly as requested by your faculty. You can use this for your revision and to explain your code if your teacher asks!

## 1. Bcrypt & Password Hashing
**What is it?** 
In `Controller/Api.js`, we use the `bcrypt` library to secure user passwords.
**How it works in your code:**
```javascript
data.password = bcrypt.hashSync(data.password, saltRound);
```
**Why we do it:**
If a hacker ever gains access to your MongoDB database, they will not see "mypassword123". They will see a random scramble of text like `$2b$10$gJLAsucy2yviXqnEYrxXrORXfCTORQRd4yt9ED7P/OKciQfa6luLS`. This ensures that even as the database owner, you cannot read your users' real passwords.

## 2. Salting (`saltRound = 10`)
**What is it?**
A "Salt" is random data added to a password *before* it gets hashed.
**How it works in your code:**
```javascript
const saltRound = 10;
```
**Why we do it:**
If two users both have the exact same password (e.g., "password123"), a basic hash would look identical for both of them in the database. 
By adding a "Salt" with `10` rounds of complexity, bcrypt adds random data to the password first. This guarantees that even if two users have the exact same password, their final hashed strings in the database will look completely different. This protects against "Rainbow Table" hacking attacks.

## 3. Comparing Passwords securely
**How it works in your code (Login):**
```javascript
const login = await bcrypt.compare(data.password, account.password);
```
**Why we do it:**
Since the password in the database is hashed, we can't just check if `userInput === databasePassword`. Instead, `bcrypt.compare` takes the plain text the user just typed, hashes it with the exact same salt logic, and checks if the resulting hashes match. 

## 4. JSON Web Tokens (JWT)
**What is it?**
A secure, digital "ID Card" given to a user after they log in.
**How it works in your code:**
When a user logs in, `jwt.sign` creates a token using your `process.env.JWT_SECRET`. 
When they try to access the dashboard, `auth.js` intercepts the request and uses `jwt.verify` to check if the token is authentic.
**Why we do it:**
HTTP requests are "stateless", meaning the server has no memory of past requests. Without a token, the server doesn't know you just logged in 2 seconds ago. The JWT proves to the server that you are who you say you are.

## 5. Email Uniqueness
**How it works in your code:**
In `Models/User.js`, we added `unique: true`:
```javascript
email: {
    type: String,
    required: true,
    unique: true 
}
```
**Why we do it:**
This enforces at the database level that no two users can register with the exact same email address, fulfilling your faculty's specific requirement. MongoDB will automatically reject any duplicate emails.
