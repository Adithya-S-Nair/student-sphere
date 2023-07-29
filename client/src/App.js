import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//CSS
import 'mdb-ui-kit/css/mdb.min.css';
import './App.css';

//Pages & Components
import Authpage from './Pages/Authpage';


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/login' element={<Authpage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App