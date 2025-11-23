// HomeScreen.js (com React Router)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleFabricaClick = () => {
    navigate('/fabrica-login');
  };

  const handleRepresentanteClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Sistema Comercial</h1>
        <p className="home-subtitle">Selecione o tipo de acesso</p>
      </div>
      
      <div className="options-container">
        <div className="option-card" onClick={handleFabricaClick}>
          <div className="option-icon">🏭</div>
          <h2 className="option-title">Fábrica</h2>
          <p className="option-description">
            Acesso ao sistema de produção e gestão industrial
          </p>
          <button className="option-button">
            Entrar
          </button>
        </div>

        <div className="option-card" onClick={handleRepresentanteClick}>
          <div className="option-icon">👔</div>
          <h2 className="option-title">Representante Comercial</h2>
          <p className="option-description">
            Acesso ao sistema de vendas e clientes
          </p>
          <button className="option-button">
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;