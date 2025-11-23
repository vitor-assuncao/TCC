// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import FabricaPage from './pages/FabricaPage';
import RepresentantePage from './pages/RepresentantePage';
import PedidoProvider from './modules/pedidos/PedidoProvider';
import PedidoForm from './modules/pedidos/PedidoForm';
import Catalogo from "./modules/Catalogo/Catalogo";
import FabricaPedidos from './pages/FabricaPedidos';
import RelatorioVendas from "./modules/relatorios/RelatorioVendas";
import FabricaMetas from "./modules/fabrica/components/FabricaMetas";
import Login from "./modules/autentificação/Login"
import FabricaLogin from './modules/autentificação/FabricaLogin';

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
