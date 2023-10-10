import React, { useState, useEffect } from "react";
import axios from 'axios'
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import '../styles/batch.css';
import { Select, TextField, Typography, Container, Grid } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import '../styles/Timetable.css';
import { Card as MuiCard, CardContent, } from '@mui/material';

const periods = [
    { name: 'Period 1', start_time: '08:00 AM', end_time: '09:30 AM' },
    { name: 'Period 2', start_time: '09:45 AM', end_time: '11:15 AM' },
    { name: 'Period 3', start_time: '11:30 AM', end_time: '01:00 PM' },
    // Add more periods with start and end times as needed
];

function AddBatch() {
    const [batchData, setBatchData] = useState(null)
    const [facultyData, setFacultyData] = useState(null)
    const [subjectData, setSubjectData] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [studentData, setStudentData] = useState([]);
    const [formData, setFormData] = useState({
    });
    const steps = ["Batch Creation", "Students Details", "TimeTable Generation"];
    const initialTimetable = Array(5).fill([]).map(() => (
        periods.map((period) => ({ subject: "", start_time: period.start_time, end_time: period.end_time }))
    ));
    const [timetable, setTimetable] = useState(initialTimetable);
    console.log(timetable);

    const handleSubjectChange = (dayIndex, periodIndex, subject) => {
        const newTimetable = [...timetable];
        newTimetable[dayIndex][periodIndex] = { subject };
        setTimetable(newTimetable);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        axios.get('http://localhost:5000/api/faculty/getallbatch')
            .then((res) => {
                if (Array.isArray(res.data.batchData) && res.data.batchData.length > 0) {
                    setBatchData(res.data.batchData);
                } else {
                    console.error("batchData is not an array or is empty:", res.data.batchData);
                }
            })
            .catch((error) => {
                console.error("Error fetching batch data:", error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/faculty/getallfaculty')
            .then((res) => {
                setFacultyData(res.data)
            })
            .catch((error) => {
                console.error("Error fetching batch data:", error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/faculty/getallsubjects')
            .then((res) => {
                setSubjectData(res.data)
            })
            .catch((err) => {
                console.error("Error fetching batch data:", err);
            })
    }, []);

    // Function to update timetable in AddBatch
    const updateTimetable = (newTimetable) => {
        setTimetable(newTimetable);
    };

    // const timetableData = {
    //     day: "Monday",
    //     subjects: timetable.map((subject) => {
    //         subject:
    //     })
    // }
    // console.log(timetableData);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Rearrange the days array to start with Monday and end with Friday
    const rearrangedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


    const formattedTimetable = rearrangedDays.map((day, dayIndex) => ({
        day: day.toLowerCase(), // Use lowercase day name if needed
        subjects: periods.map((period, periodIndex) => ({
          subject: timetable[dayIndex][periodIndex].subject.toString(), // Convert subject to string if it's an ObjectId
          start_time: period.start_time,
          end_time: period.end_time,
        })),
      }));
      
      console.log(formattedTimetable);
    const handleFinish = () => {
        console.log(formData);
        axios.post('http://localhost:5000/api/faculty/newbatch', {
            batchData: formData,
            studentData,
            timetableData: formattedTimetable
        })
            .then(() => {
                console.log('success');
            })
            .catch(() => {
                console.log('failed');
            })
    }

    return (
        <div className="registration-container">
            <div className="registration-header">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="registration-content">
                    {activeStep === 0 && <Step1 batchData={batchData} facultyData={facultyData} formData={formData} setFormData={setFormData} />}
                    {activeStep === 1 && <Step2 studentData={studentData} setStudentData={setStudentData} />}
                    {activeStep === 2 && <Step3 subjectData={subjectData} timetable={timetable} setTimetable={setTimetable} />}
                </div>
                <div className="registration-buttons">
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        className="back-button"
                    >
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFinish}
                            className="next-button"
                        >
                            Finish
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className="next-button"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div >
    );
}

function Step1({ batchData, facultyData, formData, setFormData }) {
    console.log(formData);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="step-content">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-simple-select-label">Department Name</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="course"
                    label="Department Name"
                    onChange={handleChange}
                >
                    {batchData && batchData.map((batch) => (
                        <MenuItem key={batch._id} value={batch._id}>{batch.course}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Semester</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    label="Semester"
                    name="semester"
                    onChange={handleChange}
                >
                    {batchData && batchData.map((batch) => (
                        <MenuItem key={batch._id} value={batch._id}>{batch.semester}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Faculty"
                    name="faculty"
                    onChange={handleChange}
                >
                    {facultyData && (
                        Object.keys(facultyData).map((key) => {
                            const facultyArray = facultyData[key];
                            return facultyArray && facultyArray.map((faculty) => (
                                faculty && <MenuItem key={faculty._id} value={faculty._id}>{faculty.username}</MenuItem>
                            ));
                        })
                    )}
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    name="start_date"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    name="end_date"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </div >
    );
}

function Step2({ studentData, setStudentData }) {
    const [numCards, setNumCards] = useState(0);
    console.log(studentData);

    useEffect(() => {
        // Create an array of empty student objects based on the number of cards
        const newStudentData = Array.from({ length: numCards }, (_, index) => ({
            name: "",
            roll_number: "",
            password: "",
        }));
        setStudentData(newStudentData);
    }, [numCards]);

    const handleRollNoChange = (index, rollNo) => {
        const updatedStudentData = [...studentData];
        updatedStudentData[index].roll_number = rollNo;
        // Set the password to be the same as the roll number
        updatedStudentData[index].password = rollNo;
        setStudentData(updatedStudentData);
    };

    const handleNameChange = (index, name) => {
        const updatedStudentData = [...studentData];
        updatedStudentData[index].name = name;
        setStudentData(updatedStudentData);
    };

    // Function to render the Card components based on the studentData
    const renderCards = () => {
        return studentData.map((student, index) => (
            <Card
                key={index}
                index={index}
                student={student}
                onRollNoChange={handleRollNoChange}
                onNameChange={handleNameChange}
            />
        ));
    };

    return (
        <div className="step-content">
            <div className="step2-container">
                <TextField
                    label="No. of Students"
                    type="number"
                    value={numCards}
                    onChange={(e) => setNumCards(parseInt(e.target.value, 10))}
                    className="step2-textfield mb-5"
                />
                <Grid container spacing={3} style={{ width: '100%' }} className="d-flex align-items-center justify-content-center">
                    {renderCards()}
                </Grid>
            </div>
        </div>
    );
}

const Card = ({ index, student, onRollNoChange, onNameChange }) => {
    const { roll_number, name } = student;
    return (
        <MuiCard className="card mt-2">
            <CardContent className="d-flex gap-2 align-items-center justify-content-between mt-2">
                <TextField
                    id={`rollNo-${index}`}
                    label="Roll No."
                    variant="outlined"
                    value={roll_number}
                    onChange={(e) => onRollNoChange(index, e.target.value)}
                />
                <TextField
                    id={`name-${index}`}
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => onNameChange(index, e.target.value)}
                />
            </CardContent>
        </MuiCard>
    );
};

function Step3({ subjectData, onUpdateTimetable, timetable, setTimetable }) {

    const handleSubjectChange = (dayIndex, periodIndex, selectedSubject, start_time, end_time) => {
        const newTimetable = [...timetable];
        // Update the subject property of the specific period
        newTimetable[dayIndex][periodIndex] = { subject: selectedSubject, start_time, end_time };
        setTimetable(newTimetable);
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = [
        { name: 'Period 1', start_time: '08:00 AM', end_time: '09:30 AM' },
        { name: 'Period 2', start_time: '09:45 AM', end_time: '11:15 AM' },
        { name: 'Period 3', start_time: '11:30 AM', end_time: '01:00 PM' },
        // Add more periods with start and end times as needed
    ];
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>College Student Timetable</h1>
            <table style={{
                width: '100%', borderCollapse: 'collapse',
                border: '1px solid #ccc',
                borderBottom: '1px solid #ccc'
            }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Days</th>
                        {periods.map((period, index) => (
                            <th key={index} style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>{period.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map((day, dayIndex) => (
                        <tr key={dayIndex}>
                            <td style={{ textAlign: 'left', padding: '10px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>{day}</td>
                            {periods.map((period, periodIndex) => (
                                <td key={periodIndex} style={{ textAlign: 'center', padding: '10px', borderTop: '1px solid #ccc', border: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                                    <select
                                        value={timetable[dayIndex][periodIndex].subject}
                                        onChange={(e) =>
                                            handleSubjectChange(dayIndex, periodIndex, e.target.value, period.start_time, period.end_time)
                                        }
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Select subject</option>
                                        {subjectData.subjectData.map((subject) => (
                                            <option key={subject._id} value={subject._id}>
                                                {subject.subject}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddBatch;
