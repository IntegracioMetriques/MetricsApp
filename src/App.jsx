import React from "react";
import Header from "./components/header";
import Index from "./pages/index";
import Prova from "./pages/prova";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router> 
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/prova" element={<Prova />} />
      </Routes>
    </Router>
  );
}

export default App;
