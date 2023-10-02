import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//CSS
import 'mdb-ui-kit/css/mdb.min.css';
import './App.css';

//Pages & Components
import Authpage from './Pages/Authpage';
import Attendancepage from './Pages/Attendancepage';
import Facultyhome from './Pages/Facultyhome';
import Createbatch from './Pages/Createbatch';


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/auth' element={<Authpage />} />
          <Route exact path='/facultyhome' element={<Facultyhome />} />
          <Route exact path='/createbatch' element={<Createbatch />} />
          <Route exact path='/attendance' element={<Attendancepage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App