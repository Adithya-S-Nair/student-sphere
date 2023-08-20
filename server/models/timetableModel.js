const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
