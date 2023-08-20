import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Snacksbar from '../Components/Snacksbar';
import { AuthContext } from '../Context/authContext';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox
}
  from 'mdb-react-ui-kit';

const Authpage = () => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [justifyActive, setJustifyActive] = useState('tab1');;
  const [studentLoginData, setStudentLoginData] = useState({ email: "", password: "" });
  const [facultyLoginData, setFacultyLoginData] = useState({ email: "", password: "" });
  const message = (
    <div className='d-flex gap-1 align-items-center text-danger'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: '1.5em' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <span>Invalid Credentials</span>
    </div>
  )

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleStudentLoginInputs = (e) => {
    let { name, value } = e.target;
    setStudentLoginData({ ...studentLoginData, [name]: value })
  }

  const handleFacultyLoginInputs = (e) => {
    let { name, value } = e.target;
    setFacultyLoginData({ ...facultyLoginData, [name]: value })
  }

  const handleStudentLogin = (ev) => {
    ev.preventDefault();
    console.log(studentLoginData);
  }

  const handleFacultyLogin = (ev) => {
    ev.preventDefault();
    axios.post('http://localhost:5000/api/faculty/login', {
      email: facultyLoginData.email,
      password: facultyLoginData.password
    }, { withCredentials: true })
      .then((response) => {
        if (response.status === 201) {
          setUser({ userId: response.data.id, username: response.data.username, role: response.data.role })
          navigate('/', { state: { openSnackbar: true } });
        }
      })
      .catch((error) => {
        setOpen(true)
        console.log(error);
      });

  }

  return (
    <div className="container p-5">
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
              Student
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
              Faculty
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>

          <MDBTabsPane show={justifyActive === 'tab1'}>
            <form onSubmit={handleStudentLogin}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='form1'
                type='email'
                name='email'
                value={studentLoginData.email}
                onChange={handleStudentLoginInputs} />
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='form2'
                type='password'
                name='password'
                value={studentLoginData.password}
                onChange={handleStudentLoginInputs} />
              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' checked />
                <a href="!#">Forgot password?</a>
              </div>
              <MDBBtn type='submit' className="mb-4 w-100">Sign in</MDBBtn>
            </form>
          </MDBTabsPane>

          <MDBTabsPane show={justifyActive === 'tab2'}>
            <form onSubmit={handleFacultyLogin}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='form1'
                type='email'
                name='email'
                value={facultyLoginData.email}
                onChange={handleFacultyLoginInputs} />
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='form2'
                type='password'
                name='password'
                value={facultyLoginData.password}
                onChange={handleFacultyLoginInputs} />
              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' checked />
                <a href="!#">Forgot password?</a>
              </div>
              <MDBBtn className="mb-4 w-100">Sign in</MDBBtn>
            </form>
          </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer>
      <Snacksbar open={open} setOpen={setOpen} message={message} />
    </div>
  );
}

export default Authpage