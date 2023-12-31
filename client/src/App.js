import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//CSS
import 'mdb-ui-kit/css/mdb.min.css';
import './App.css';

//Pages & Components
import Authpage from './Pages/Authpage';
import Attendancepage from './Pages/Attendancepage';
import Facultyhome from './Pages/Facultyhome';
import AddBatch from './Pages/AddBatch';
import MarkManagement from './Pages/MarkManagement';
import Studenthome from './Pages/Studenthome';


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/auth' element={<Authpage />} />
          <Route exact path='/facultyhome' element={<Facultyhome />} />
          <Route exact path='/addbatch' element={<AddBatch />} />
          <Route exact path='/attendance' element={<Attendancepage />} />
          <Route exact path='/entermark' element={<MarkManagement />} />
          <Route exact path='/studenthome' element={<Studenthome />} />
        </Routes>
      </Router>
    </>
  )
}

export default App