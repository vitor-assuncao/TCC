import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./FabricaMetas.css";

const FabricaMetas = () => {
  const [representantes, setRepresentantes] = useState([]);
  const [metas, setMetas] = useState([]);
  const [form, setForm] = useState({
    representante_id: "",
    periodo: "",
    valor_meta: "",
  });

  // carregar representantes e metas existentes
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const reps = await api.get("/representantes");
        setRepresentantes(reps.data);
        const metasResp = await api.get("/metas");
        setMetas(metasResp.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.representante_id || !form.periodo || !form.valor_meta) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/metas", form);
      alert("Meta registrada com sucesso!");
      const metasResp = await api.get("/metas");
      setMetas(metasResp.data);
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      alert("Erro ao criar meta.");
    }
  };

  return (
    <div className="metas-container">
      <h2>🎯 Definir Metas de Vendas</h2>

      <form onSubmit={handleSubmit} className="metas-form">
        <div>
          <label>Representante:</label>
          <select
            name="representante_id"
            value={form.representante_id}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {representantes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Período (AAAA-MM):</label>
          <input
            type="month"
            name="periodo"
            value={form.periodo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Meta (R$):</label>
          <input
            type="number"
            name="valor_meta"
            value={form.valor_meta}
            onChange={handleChange}
            step="0.01"
          />
        </div>

        <button type="submit">💾 Salvar Meta</button>
      </form>

      <h3>📋 Metas Cadastradas</h3>
<table className="metas-tabela">
  <thead>
    <tr>
      <th>Representante</th>
      <th>Período</th>
      <th>Meta (R$)</th>
      <th>Realizado (R$)</th>
      <th>Atingimento (%)</th>
    </tr>
  </thead>
  <tbody>
    {metas.map((m) => (
      <tr key={m.id}>
        <td>{m.representante}</td>
        <td>{m.periodo}</td>
        <td>R$ {Number(m.valor_meta).toFixed(2)}</td>
        <td>R$ {Number(m.valor_realizado).toFixed(2)}</td>
        <td>
          {m.percentual_atingido
            ? `${Number(m.percentual_atingido).toFixed(2)}%`
            : "0%"}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default FabricaMetas;
