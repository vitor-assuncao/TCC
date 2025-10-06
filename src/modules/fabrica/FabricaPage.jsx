// FabricaPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FabricaPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')}>← Voltar</button>
      <h1>Página da Fábrica</h1>
      <p>Conteúdo específico para a fábrica...</p>
    </div>
  );
};

export default FabricaPage;