const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // To handle JSON request bodies

// Logging middleware
app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}, Body: ${JSON.stringify(req.body)}`);
    next();
});

// User schema and model
const userSchema = new mongoose.Schema({
    entryPass: String,
    dressCode: String,
});

const User = mongoose.model('User', userSchema);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    const { entryPass, dressCode } = req.body;
    if ((entryPass === 'VIP' || entryPass === 'Normal') && dressCode === 'Formal') {
        next(); // User is authenticated, proceed to the route handler
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }
};

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Routes
app.post('/entry', isAuthenticated, (req, res) => {
    res.json({ message: 'Welcome! You are authenticated.' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
