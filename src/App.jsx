// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import FabricaPage from './pages/FabricaPage';
import RepresentantePage from './pages/RepresentantePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/fabrica" element={<FabricaPage />} />
          <Route path="/representante" element={<RepresentantePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;