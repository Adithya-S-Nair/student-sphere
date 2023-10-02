require("dotenv").config();
const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");
const Timetable = require("../models/timetableModel");
const Subject = require("../models/subjectModel");
const Attendance = require("../models/attendanceModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({ msg: "User Not Found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Wrong password" });
        }
        const date = new Date()
        await User.updateOne({ email }, { $set: { lastLoggedInAt: date } });
        jwt.sign({ userId: userData._id, username: userData.username, role: userData.role }, process.env.JWT_SECRET, (err, token) => {
            if (err)
                throw err
            res.cookie('token', token).status(201).json({ id: userData._id, username: userData.username });
        })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}

const registerFaculty = async (req, res) => {
    if (req.role === 'superfaculty') {
        const { username, email, password } = req.body
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'faculty'
        });
        newUser.save()
            .then((response) => {
                res.status(201).json({ id: response._id, username })
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({ error: 'Error creating user' });
            });
    } else {
        res.status(401).json({ msg: 'Not a super faculty' })
    }
}

const createNewBatch = async (req, res) => {
    try {
        const studentData = req.body.studentData;
        const timetableData = req.body.timetableData;
        const batchData = req.body.batchData;

        // Step 1: Insert each student into the Student collection
        const students = await Student.insertMany(studentData);

        // Step 2: Insert the timetable data into the Timetable collection
        const timetable = new Timetable(timetableData);
        const savedTimetable = await timetable.save();

        // Step 3: Insert batch data into the Batch collection
        const batch = new Batch({
            ...batchData,
            timetable_id: savedTimetable._id,
            student_ids: students.map((student) => student._id),
        });
        const savedBatch = await batch.save();

        res.status(201).json({ message: 'Batch created successfully' });
    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateStudentAttendance = async (studentId, timetableId, subjectId, date, attendanceStatus) => {
    try {
        // Find the student by their ID
        const student = await Student.findById(studentId);
        console.log(student);
        if (!student) {
            throw new Error('Student not found');
        }

        // Find the relevant attendance record or create a new one
        const attendanceRecord = student.attendance.find((record) => {
            return record.timetableId.equals(timetableId) && record.subjectId.equals(subjectId);
        });

        if (attendanceRecord) {
            // If the record already exists, update the attendance status for the given date
            const attendanceEntry = attendanceRecord.attendanceEntries.find((entry) => entry.date === date);

            if (attendanceEntry) {
                attendanceEntry.status = attendanceStatus;
            } else {
                // If the date is not found, create a new entry
                attendanceRecord.attendanceEntries.push({ date, status: attendanceStatus });
            }
        } else {
            // If no attendance record exists, create a new one
            student.attendance.push({
                timetableId,
                subjectId,
                attendanceEntries: [{ date, status: attendanceStatus }],
            });
        }

        // Save the updated student document
        await student.save();
    } catch (error) {
        throw error;
    }
};

const markAttendance = async (req, res) => {
    try {
        const { batch_id, subject_id, date, students } = req.body;

        for (const studentData of students) {
            const { student_id, attendance_status } = studentData;

            await updateStudentAttendance(student_id, batch_id, subject_id, date, attendance_status);
        }

        res.status(200).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    registerFaculty,
    loginFaculty,
    createNewBatch,
    markAttendance,
    updateStudentAttendance,
};