import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const MarkManagement = () => {
    const [course, setCourse] = React.useState(null)
    const [semester, setSemester] = React.useState(null)
    const [batchData, setBatchData] = React.useState(null)
    const [studentData, setStudentData] = React.useState(null)
    // const [internalMark1, setInternalMark1] = React.useState(null)
    // const [internalMark2, setInternalMark2] = React.useState(null)
    // const [assignmentMark1, setAssignmentMark1] = React.useState(null)
    // const [assignmentMark2, setAssignmentMark2] = React.useState(null)
    const [marksData, setMarksData] = React.useState([]);
    console.log(marksData);
    React.useEffect(() => {
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

    const getStudents = () => {
        axios.post('http://localhost:5000/api/student/getallstudents', {
            course,
            semester
        })
            .then((res) => {
                console.log(res.data);
                setStudentData(res.data)
                const initialMarksData = res.data.students.map(student => ({
                    _id: student._id,
                    internalMark1: '',
                    internalMark2: '',
                    assignmentMark1: '',
                    assignmentMark2: '',
                }));
                setMarksData(initialMarksData);
            })
            .catch((error) => {
                console.error("Error fetching batch data:", error);
            });
    }
    const handleMarkChange = (studentId, markType, value) => {
        // Find the student's marks object
        const updatedMarksData = marksData.map(studentMarks => {
            if (studentMarks._id === studentId) {
                return {
                    ...studentMarks,
                    [markType]: value,
                };
            }
            return studentMarks;
        });
        setMarksData(updatedMarksData);
    };

    const handlePublish = () => {
        // Prepare the mark data for submission
        const marksToPublish = marksData.map(studentMarks => ({
            studentId: studentMarks._id,
            internalMark1: studentMarks.internalMark1,
            internalMark2: studentMarks.internalMark2,
            assignmentMark1: studentMarks.assignmentMark1,
            assignmentMark2: studentMarks.assignmentMark2,
        }));

        // Make an HTTP POST request to the server
        axios
            .post('http://localhost:5000/api/faculty/entermark', marksToPublish)
            .then((res) => {
                // Handle success
                console.log('Marks published successfully');
                // Optionally, you can reset the marksData state or perform other actions here.
            })
            .catch((error) => {
                // Handle errors
                console.error('Error publishing marks:', error);
            });
    };

    return (
        <>
            <div className="mt-5 pt-5">
                <div className="mt-5 pt-5">
                    <div className="mt-5 pt-5">
                        <div className="mt-5 pt-5">
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="d-flex gap-2 mb-2 mt-5 pt-5">
                                <FormControl fullWidth>
                                    <InputLabel id="department-label">Department</InputLabel>
                                    <Select
                                        labelId="department-label"
                                        id="department-select"
                                        value={course}
                                        label="Department"
                                        onChange={(e) => { setCourse(e.target.value) }}
                                    >
                                        {batchData && batchData.map((batch) => (
                                            <MenuItem key={batch._id} value={batch.course}>{batch.course}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="semester-label">Semester</InputLabel>
                                    <Select
                                        labelId="semester-label"
                                        id="semester-select"
                                        value={semester}
                                        label="Semester"
                                        onChange={(e) => { setSemester(e.target.value) }}
                                    >
                                        {batchData && batchData.map((batch) => (
                                            <MenuItem key={batch._id} value={batch.semester}>{batch.semester}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <span className='btn btn-primary d-flex align-items-center' onClick={getStudents}>Submit</span>
                            </div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell colSpan={1}></StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">Internal Marks</StyledTableCell>
                                            <StyledTableCell colSpan={2} align="center">Assignment Marks</StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Internal Mark 1</StyledTableCell>
                                            <StyledTableCell>Internal Mark 2</StyledTableCell>
                                            <StyledTableCell>Assignment Mark 1</StyledTableCell>
                                            <StyledTableCell>Assignment Mark 2</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {studentData && studentData.students.map((row) => (
                                            <StyledTableRow key={row._id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <input type="text" value={marksData.find(student => student._id === row._id).internalMark1} onChange={(e) => handleMarkChange(row._id, 'internalMark1', e.target.value)} />
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <input type="text" value={marksData.find(student => student._id === row._id).internalMark2} onChange={(e) => handleMarkChange(row._id, 'internalMark2', e.target.value)} />
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <input type="text" value={marksData.find(student => student._id === row._id).assignmentMark1} onChange={(e) => handleMarkChange(row._id, 'assignmentMark1', e.target.value)} />
                                                </StyledTableCell>
                                                <StyledTableCell align="right">
                                                    <input type="text" value={marksData.find(student => student._id === row._id).assignmentMark2} onChange={(e) => handleMarkChange(row._id, 'assignmentMark2', e.target.value)} />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className="text-center">
                                <button className='mt-3 mb-5 btn btn-primary' onClick={handlePublish}>Publish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default MarkManagement;
