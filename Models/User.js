const mongoose = require('mongoose');

// Define what a User looks like in our database
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // This fulfills the  "email uniqueness check" requirement
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }); // This automatically adds createdAt and updatedAt dates

// Create and export the Model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
