// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import FabricaPage from './pages/FabricaPage';
import RepresentantePage from './pages/RepresentantePage';
import PedidoProvider from './modules/gestao pedidos/PedidoProvider';
import PedidoForm from './modules/gestao pedidos/PedidoForm';
import Catalogo from "./modules/representante/Catalogo";
import FabricaPedidos from './modules/fabrica/FabricaPedidos';
import RelatorioVendas from "./modules/relatorios/RelatorioVendas";
import FabricaMetas from "./modules/fabrica/FabricaMetas";
import Login from "./modules/autenticação/Login"
import FabricaLogin from './modules/autenticação/FabricaLogin';

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
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/pedido" element={<PedidoForm />} />
            <Route path="/fabrica-pedidos" element={<FabricaPedidos />} />
            <Route path="/relatorio-vendas" element={<RelatorioVendas />} />
            <Route path="/fabrica-metas" element={<FabricaMetas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/fabrica-login" element={<FabricaLogin />} />
          </Routes>
        </div>
      </Router>
    </PedidoProvider>
  );
}

export default App;
