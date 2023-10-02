const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  },
  attendanceEntries: [
    {
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ['true', 'false'], // Assuming 'true' and 'false' are the possible attendance statuses
      },
    },
  ],
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  attendance: [attendanceSchema], // Include the attendance field
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
