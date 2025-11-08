// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import FabricaPage from './pages/FabricaPage';
import RepresentantePage from './pages/RepresentantePage';
import PedidoProvider from './modules/pedidos/PedidoProvider';
import PedidoForm from './modules/pedidos/PedidoForm';

function App() {
  return (
    <PedidoProvider>
      {/* 🔹 O Router precisa envolver as rotas */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/fabrica" element={<FabricaPage />} />
            <Route path="/representante" element={<RepresentantePage />} />
            <Route path="/pedido" element={<PedidoForm representanteId={1} />} />
          </Routes>
        </div>
      </Router>
    </PedidoProvider>
  );
}

export default App;
