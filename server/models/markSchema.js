const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    internal1: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Internal 1
    },
    internal2: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Internal 2
    },
    semesterExamMark: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Semester Exam Mark
    },
    assignmentMark: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Assignment Mark
    },
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
