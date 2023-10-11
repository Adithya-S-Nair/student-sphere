const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student model
        required: true,
    },
    internalMark1: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Internal Mark 1
    },
    internalMark2: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Internal Mark 2
    },
    assignmentMark1: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Assignment Mark 1
    },
    assignmentMark2: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a maximum score of 100 for Assignment Mark 2
    },
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
