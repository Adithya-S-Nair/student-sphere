const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const studentRoute = require('./routes/studentRoute')
const facultyRoute = require('./routes/facultyRoute')

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/uploads', express.static(__dirname + '/uploads'))

// Use the routes
// app.use('/api/student', studentRoute);
app.use('/api/faculty', facultyRoute);
app.use('/api/student', studentRoute);

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});