import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Users from "./pages/Users";
import Courses from './pages/Courses';
import Matricula from './pages/Matricula';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/matricula" element={<Matricula />} />
      </Routes>
    </Router>
  );
}

export default App;
