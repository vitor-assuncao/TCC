// RepresentantePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RepresentantePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')}>← Voltar</button>
      <h1>Página do Representante Comercial</h1>
      <p>Conteúdo específico para representantes...</p>
    </div>
  );
};

export default RepresentantePage;