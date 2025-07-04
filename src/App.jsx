import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Index from "./pages/index";
import PullRequestsPage from "./pages/PullRequestsPage";
import CommitsPage from "./pages/commitsPage";
import IssuesPage from "./pages/issuesPage";
import IndividualPage from "./pages/individualPage";
import ProjectsPage from "./pages/projectsPage";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [data, setData] = useState(null);
  const [historicData, setHistoricData] = useState(null);
  const [config, setConfig] = useState({ features: [] });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, configRes] = await Promise.all([
          fetch('./metrics.json?timestamp=' + new Date().getTime()),
          fetch('./config.json?timestamp=' + new Date().getTime()),
        ]);
  
        if (!metricsRes.ok) {
          throw new Error(`Error ${metricsRes.status}: No s'ha pogut carregar l'arxiu metrics.json`);
        }
        const metricsData = await metricsRes.json();
        setData(metricsData);
          if (configRes.ok) {
          const configData = await configRes.json();
          setConfig(configData.features ? configData : { features: ["issues", "pull-requests"] });
        } else {
          setConfig({ features: ["issues", "pull-requests"] });
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchHistoricData = async () => {
      try {
        const response = await fetch('./historic_metrics.json?timestamp=' + new Date().getTime());
        if (response.ok) {
          const result = await response.json();
          setHistoricData(result);
        } else {
          setHistoricData(null);
        }
      } catch {
        setHistoricData(null);
      }
    };

    fetchData();
    fetchHistoricData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        textAlign: "center",
        fontSize: "1.8rem",
      }}>
        Error al carregar les dades de metrics.json. <br />
        Si encara no existeix, fes una execució manual del workflow Metrics o fes un primer push al repository.
      </div>
    );    
  }
  return (
    <Router>
      <Header features={config.features}/>
      <Routes>
        <Route path="/" element={<Navigate to="/general" />} />
        <Route path="/general" element={<Index data={data} historicData={historicData} features={config.features} />} />
        <Route path="/commits" element={<CommitsPage data={data} historicData={historicData} features={config.features}/>} />
        <Route path="/issues" element={<IssuesPage data={data}  historicData={historicData} features={config.features}/>} />
        <Route path="/pull-requests" element={<PullRequestsPage data={data}  historicData={historicData} features={config.features}/>} />
        <Route path="/projects" element={<ProjectsPage data={data}  historicData={historicData} features={config.features}/>} />
        <Route path="/individual" element={<IndividualPage data={data} historicData={historicData} features={config.features}/>} />
      </Routes>
    </Router>
  );
}

export default App;
