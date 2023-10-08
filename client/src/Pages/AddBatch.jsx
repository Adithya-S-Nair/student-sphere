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

const days = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri'];
const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7'];
const subjects = ['Computer Graphics', 'Web Data', 'Cryptography', 'Mini Project', 'Mobile Computing', 'Seminar', 'E-commerce'];


function AddBatch() {
    const [batchData, setBatchData] = useState(null)
    const [facultyData, setFacultyData] = useState(null)
    console.log(batchData);
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["Batch Creation", "Students Details", "TimeTable Generation"];
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
                    {activeStep === 0 && <Step1 batchData={batchData} facultyData={facultyData} />}
                    {activeStep === 1 && <Step2 />}
                    {activeStep === 2 && <Step3 />}
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className="next-button"
                    >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                </div>
            </div>
        </div >


    );
}


function Step1({ batchData, facultyData }) {
    console.log(facultyData);
    const [formData, setFormData] = useState({
        batchName: "",
        startDate: null,
        endDate: null,
    });


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

                    label="Department Name"
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
            </FormControl >
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"

                    label="Age"
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
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>

        </div >
    );
}




function Step2() {
    return (
        <div className="step-content">

        </div>
    );
}

function Step3() {
    const [timetable, setTimetable] = useState(
        Array(5).fill(Array(7).fill(''))
    );

    const handleSubjectChange = (dayIndex, periodIndex, subject) => {
        const newTimetable = [...timetable];
        newTimetable[dayIndex][periodIndex] = subject;
        setTimetable(newTimetable);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>College Student Timetable</h1>
            <table style={{
                width: '100%', borderCollapse: 'collapse',
                border: '1px solid #ccc',
                borderBottom: '1px solid #ccc'
            }}>

                <thead>
                    < tr >
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Days</th>
                        {periods.map((period, index) => (
                            <th key={index} style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>{period}</th>
                        ))}
                    </tr>
                </thead >
                <tbody>
                    {days.map((day, dayIndex) => (
                        <tr key={dayIndex}>
                            <td style={{ textAlign: 'left', padding: '10px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>{day}</td>
                            {periods.map((period, periodIndex) => (
                                <td key={periodIndex} style={{ textAlign: 'center', padding: '10px', borderTop: '1px solid #ccc', border: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                                    <select
                                        value={timetable[dayIndex][periodIndex]}
                                        onChange={(e) =>
                                            handleSubjectChange(dayIndex, periodIndex, e.target.value)
                                        }
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Select subject</option>
                                        {
                                            subjects.map((subject, subjectIndex) => (
                                                <option key={subjectIndex} value={subject}>
                                                    {subject}
                                                </option>
                                            ))
                                        }
                                    </select >
                                </td >
                            ))
                            }
                        </tr >
                    ))}
                </tbody >
            </table >
        </div >
    );
}

export default AddBatch;

