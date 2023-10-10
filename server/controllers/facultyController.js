require("dotenv").config();
const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");
const Timetable = require("../models/timetableModel");
const Subject = require("../models/subjectModel");
const Marks = require("../models/markSchema");
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

        // Step 2: Create an array to store timetable data
        const formattedTimetable = [];

        // Loop through the incoming timetable data
        for (const dayData of timetableData) {
            // Validate and sanitize the day data as needed
            const formattedDay = {
                day: dayData.day.toLowerCase(), // Use lowercase day name if needed
                subjects: dayData.subjects.map((subject) => ({
                    subject: subject.subject.toString(), // Convert subject to string if it's an ObjectId
                    start_time: subject.start_time,
                    end_time: subject.end_time,
                })),
            };
            formattedTimetable.push(formattedDay);
        }
        const savedTimetableIds = [];
        console.log(formattedTimetable);
        for (const dayData of formattedTimetable) {
            // Create a new Timetable instance for the current day
            const newTimetable = new Timetable({
                day: dayData.day, // Set the day from the current dayData
                subjects: dayData.subjects, // Set the subjects from the current dayData
            });

            // Save the newTimetable instance to the database
            const savedTimetable = await newTimetable.save();
            savedTimetableIds.push(savedTimetable._id);

        }
        console.log(savedTimetableIds);
        // Step 4: Insert batch data into the Batch collection
        const batch = new Batch({
            ...batchData,
            timetable_ids: savedTimetableIds,
            student_ids: students.map((student) => student._id),
        });
        console.log(batch);
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

const enterMark = async (req, res) => {
    try {
        const batch_id = req.body.batch_id; // Replace with the actual batch ID
        const subject_id = req.body.subject_id; // Replace with the actual subject ID
        const date = new Date(req.body.date);
        const studentsData = req.body.students;

        // Create an array to store the mark documents to be inserted
        const markDocuments = [];

        // Iterate through the studentsData array
        for (const studentData of studentsData) {
            const student_id = studentData.student_id; // Replace with the actual student ID
            const { internal1, internal2, semesterExamMark, assignmentMark } = studentData;

            // Create a new mark document
            const mark = new Marks({
                internal1,
                internal2,
                semesterExamMark,
                assignmentMark,
            });

            // Push the mark document into the array
            markDocuments.push(mark);

            // Find the student by ID and update their marks
            await Student.findByIdAndUpdate(
                student_id,
                {
                    $push: {
                        marks: {
                            batch_id,
                            subject_id,
                            date,
                            mark: mark._id, // Reference to the newly created mark
                        },
                    },
                },
                { new: true }
            );
        }

        // Insert the mark documents into the Mark collection
        await Marks.insertMany(markDocuments);

        res.status(201).json({ message: 'Marks entered successfully' });
    } catch (error) {
        console.error('Error entering marks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addSubject = (req, res) => {
    const subject = req.body
    console.log(subject)
}

const getAllBatch = (req, res) => {
    Batch.find().then((response) => {
        res.status(200).json({ batchData: response })
    }).catch((err) => {
        res.status(500).json({ msg: err })
    })
}

const getAllFaculty = (req, res) => {
    User.find({}, 'username').then((response) => {
        res.status(200).json({ facultyData: response })
    }).catch((err) => {
        res.status(500).json({ msg: err })
    })
}

const getAllSubjects = (req, res) => {
    Subject.find({}, 'subject')
        .then((response) => {
            res.status(200).json({ subjectData: response })
        })
        .catch((err) => {
            res.status(500).json({ msg: err })
        })
}

module.exports = {
    registerFaculty,
    loginFaculty,
    createNewBatch,
    markAttendance,
    updateStudentAttendance,
    enterMark,
    addSubject,
    getAllBatch,
    getAllFaculty,
    getAllSubjects
};