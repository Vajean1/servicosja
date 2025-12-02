// RatingChart.jsx (AreaChart - Cor Sólida)
import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Componente de Gráfico de Distribuição de Estrelas (usando Recharts)
 * @param {object} distribuicao - O objeto de distribuição de estrelas recebido do backend.
 */
const RatingChart = ({ distribuicao }) => {
  // ... (Lógica de Transformação de Dados permanece a mesma) ...
  const chartData = useMemo(() => {
    // Retorna um array de objetos para o Recharts
    return Object.keys(distribuicao)
      .map(key => {
        const starNumber = key.split('_')[1];
        const data = distribuicao[key];

        return {
          name: `${starNumber} Estrela${starNumber > 1 ? 's' : ''}`,
          Porcentagem: data.porcentagem,
          Quantidade: data.quantidade,
        };
      })
      .sort((a, b) => parseInt(a.name.split(' ')[0]) - parseInt(b.name.split(' ')[0]));
  }, [distribuicao]);

  if (Object.keys(distribuicao).length === 0) {
    return <p>Aguardando dados de avaliação...</p>;
  }

  // 2. Renderização do Gráfico
  return (
    <div style={{ width: '100%', height: 250, margin: '20px 0' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          {/* Eixo X: Rótulos das estrelas */}
          <XAxis 
            dataKey="name" 
            stroke="#555"
          /> 
          
          {/* Eixo Y: Porcentagem (de 0 a 100) */}
          <YAxis 
            type="number" 
            domain={[0, 100]} 
            label={{ value: 'Porcentagem (%)', angle: -90, position: 'insideLeft', fill: '#555' }}
            stroke="#555"
          />
          
          <Tooltip 
            formatter={(value, name) => [value, name === 'Porcentagem' ? `${name} (%)` : name]}
          />
          
          {/* ALTERAÇÃO: Cor sólida #ff432e (opacidade 1.0) */}
          <Area 
            type="monotone" 
            dataKey="Porcentagem" 
            stroke="#ff432e"    // Linha da área
            fill="#ff432e"      // Preenchimento da área
            fillOpacity={1.0}   // <-- Cor Sólida (Opacidade máxima)
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingChart;