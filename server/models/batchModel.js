const mongoose = require('mongoose');

// Define the Batch schema
const batchSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    faculty: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    timetable_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable', // This references the Timetable model
    },
    // You can add any other fields you need for the Batch schema here
});

// Create and export the Batch model
const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;