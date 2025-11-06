import React, { useState, useEffect } from "react";
import "./ClienteForm.css";

const ClienteForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    representante_id: "",
  });

  const [representantes, setRepresentantes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // 🔹 Buscar representantes existentes
  useEffect(() => {
    const fetchRepresentantes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/representantes");
        const data = await response.json();
        setRepresentantes(data);
      } catch (error) {
        console.error("Erro ao carregar representantes:", error);
      }
    };
    fetchRepresentantes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch("http://localhost:3001/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar cliente");

      alert("✅ Cliente cadastrado com sucesso!");
      setFormData({
        nome: "",
        documento: "",
        email: "",
        telefone: "",
        endereco: "",
        representante_id: "",
      });
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cliente-form">
      <h3>Cadastro de Cliente</h3>
      {erro && <p className="error">❌ {erro}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Documento (CPF/CNPJ) *</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <textarea
            name="endereco"
            rows="3"
            value={formData.endereco}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Representante Responsável</label>
          <select
            name="representante_id"
            value={formData.representante_id}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {representantes.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.nome}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar Cliente"}
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;
