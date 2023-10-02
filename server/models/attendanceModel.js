const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true,
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    students: [
        {
            student_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
                required: true,
            },
            attendance_status: {
                type: Boolean,
                default:'false'
            },
        },
    ],
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;