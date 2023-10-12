import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/authContext';

const Studenthome = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const { user } = useState(AuthContext);
    const [studentMarks, setStudentMarks] = useState([]);
    const [student, setStudent] = useState(null);
    console.log(student);

    useEffect(() => {
        // Make an API request to get student marks using the user's ID
        axios.get(`http://localhost:5000/api/student/getuser/${id}`)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    setStudent(response.data.user);
                } else {
                    // Handle the case where fetching marks failed
                    console.error('Failed to fetch student marks');
                }
            })
            .catch((error) => {
                // Handle the case where an error occurred
                console.error('Error fetching student marks:', error);
            });
    }, []);

    useEffect(() => {
        // Make an API request to get student marks using the user's ID
        axios.get(`http://localhost:5000/api/student/getmarks/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setStudentMarks(response.data.marks);
                } else {
                    // Handle the case where fetching marks failed
                    console.error('Failed to fetch student marks');
                }
            })
            .catch((error) => {
                // Handle the case where an error occurred
                console.error('Error fetching student marks:', error);
            });
    }, []);

    return (
        <div>
            <h1>Welcome, {student.name}</h1>
            <h2>Your Marks:</h2>
            <ul>
                {studentMarks.map((mark, index) => (
                    <li key={index}>
                        Subject: {mark.subject}
                        <br />
                        Mark: {mark.mark}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Studenthome;





