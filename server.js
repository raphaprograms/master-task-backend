const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Set up all variables in the .env file
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully Connected to MongoDB!'))
.catch(err => console.error('Connection error', err));

const PORT = process.env.PORT || 4000;
const app = express()


// ====== Middleware ======
app.use(morgan('dev')); // logger
app.use(express.json()); // body parser
app.use(cors({origin: "http://localhost:5173"}));
require('./config/passport');

// ==== Routes =============
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));


// Use this route to set up the API documentation
app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});