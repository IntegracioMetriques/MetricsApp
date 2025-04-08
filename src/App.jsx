import React from "react";
import Header from "./components/header";
import Index from "./pages/index";
import Prova from "./pages/prova";
import { HashRouter as Router, Routes, Route,Navigate } from 'react-router-dom';


function App() {
  return (
    <Router> 
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/general" />} />
        <Route path="/general" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
