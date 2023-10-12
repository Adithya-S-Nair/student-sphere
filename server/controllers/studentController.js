require("dotenv").config();
const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");
const Timetable = require("../models/timetableModel");
const Subject = require("../models/subjectModel");
const Marks = require("../models/markSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginStudent = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userData = await Student.findOne({ name: username });
        if (!userData) {
            return res.status(404).json({ msg: "User Not Found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Wrong password" });
        }
        return res.status(200).json({ msg: "Login successful", user: userData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getAllStudents = async (req, res) => {
    const { course, semester } = req.body;
    try {
        const batch = await Batch.findOne({ course, semester });

        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        const students = await Student.find({ batch_id: batch._id }, 'name _id'); // Include _id field
        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMarks = async (req, res) => {
    try {
        const userId = req.params.id; // Extract userId from URL params

        // Use Mongoose to find marks data for the given userId from the Marks model
        const marks = await Marks.findOne({ userId });

        if (!marks) {
            // If marks are not found, you can still send the user data in the response
            return res.status(404).json({ error: 'Marks not found', user });
        }

        // If marks are found, send them in the response along with the user data
        return res.status(200).json({ marks });
    } catch (error) {
        // Handle any errors, e.g., send an error response
        return res.status(500).json({ error: 'Error fetching data' });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.id; // Extract userId from URL params
        const user = await Student.findOne({ _id:userId }, 'name');
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found', user });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching data' });
    }
}

module.exports = {
    loginStudent,
    getAllStudents,
    getMarks,
    getUser
};