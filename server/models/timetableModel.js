const mongoose = require('mongoose');

// Define the Timetable schema
const timetableSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    subjects: [
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject', // Reference to a Subject model (if you have one)
                required: true,
            },
            start_time: {
                type: String,
                required: true,
            },
            end_time: {
                type: String,
                required: true,
            },
        },
    ],
    // You can add any other fields you need for the Timetable schema here
});

// Create and export the Timetable model
const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;