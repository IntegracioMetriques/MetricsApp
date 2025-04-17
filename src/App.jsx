import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Index from "./pages/index";
import Placeholder from "./pages/placeholder";
import Commits from "./pages/commits";
import Issues from "./pages/issues";
import Individual from "./pages/individual";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./metrics.json?timestamp=' + new Date().getTime());
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No s'ha pogut carregar l'arxiu metrics.json`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error al carregar les dades de metrics.json.</div>;
  }
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/general" />} />
        <Route path="/general" element={<Index data={data} />} />
        <Route path="/commits" element={<Commits data={data}/>} />
        <Route path="/issues" element={<Issues data={data}/>} />
        <Route path="/pull-requests" element={<Placeholder/>} />
        <Route path="/individual" element={<Individual data={data}/>} />
      </Routes>
    </Router>
  );
}

export default App;
