const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for students
        required: true,
    },
    timetable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    isPresent: {
        type: Boolean,
        required: true,
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
