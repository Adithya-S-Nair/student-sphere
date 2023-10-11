require("dotenv").config();
const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");
const Timetable = require("../models/timetableModel");
const Subject = require("../models/subjectModel");
const Marks = require("../models/markSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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


module.exports = {
    getAllStudents
};