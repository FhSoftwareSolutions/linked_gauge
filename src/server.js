const express = require('express');
const http = require('http');
const cors = require('cors');
// Você está importando o prisma de um arquivo 'db.js', o que está correto.
// A linha abaixo é apenas para garantir que funcione se o seu db.js exportar o client.
const prisma = require('./db.js'); // Assumindo que db.js exporta o prisma client.
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Pluviômetro está funcionando!' });
});

// ROTA PARA O OVERVIEW MENSAL (total de chuva por mês) - VERSÃO CORRIGIDA
app.get('/data/overview/monthly', async (req, res) => {
    // LINHA DE TESTE: Adicione esta linha
    console.log('--- EXECUTANDO A ROTA DE OVERVIEW MENSAL (VERSÃO CORRIGIDA) ---');

    try {
        const monthlyData = await prisma.$queryRaw`
            SELECT 
                strftime('%Y-%m', "dataRecebida") as "month",
                SUM("mm_de_chuva") as "totalAmount"
            FROM "Leitura"
            GROUP BY strftime('%Y-%m', "dataRecebida")
            ORDER BY "month" ASC;
        `;
        const sanitizedData = monthlyData.map(d => ({ ...d, totalAmount: Number(d.totalAmount) }));
        res.json(sanitizedData);
    } catch (error) {
        console.error("Erro ao buscar overview mensal:", error);
        res.status(500).json({ error: "Erro interno ao buscar dados." });
    }
});

// VERSÃO CORRIGIDA
app.post('/arduinoData', async (req, res) => {
  const { pulsos } = req.body;
  if (pulsos === undefined) {
    return res.status(400).json({ error: 'O campo "pulsos" é obrigatório.' });
  }
  const mm_de_chuva = pulsos * 0.25;

  try {
    const leitura = await prisma.leitura.create({
      data: {
        pulsos,
        mm_de_chuva,
        dataRecebida: new Date().toISOString() // <--- CORREÇÃO APLICADA
      }
    });

    console.log('Dados salvos no banco:', leitura);
    res.status(201).json({ message: 'Dados recebidos com sucesso', leitura });
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    res.status(500).json({ error: 'Erro interno ao salvar os dados' });
  }
});

// --- CÓDIGO PARA O DASHBOARD ---

const getStartDate = (period) => {
  // ... (esta função continua exatamente a mesma)
  const now = new Date();
  if (period === 'day') {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  if (period === 'week') {
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    now.setDate(diff);
    now.setHours(0, 0, 0, 0);
    return now;
  }
  if (period === 'month') {
    now.setDate(1);
    now.setHours(0, 0, 0, 0);
    return now;
  }
  return now;
};

// ROTA PARA DADOS DO DIA (detalhado)
app.get('/data/today', async (req, res) => {
  const data = await prisma.leitura.findMany({
    where: { dataRecebida: { gte: getStartDate('day') } },
    orderBy: { dataRecebida: 'asc' },
  });
  return res.json(data);
});

// ROTA PARA DADOS DA SEMANA (agregado) - AJUSTADA PARA SQLITE
app.get('/data/week', async (req, res) => {
    // CORREÇÃO AQUI: Usando a função date() em minúsculo para SQLite
    const weekData = await prisma.$queryRaw`
        SELECT date("dataRecebida") as date, SUM("mm_de_chuva") as "totalAmount"
        FROM "Leitura"
        WHERE "dataRecebida" >= ${getStartDate('week')}
        GROUP BY date("dataRecebida")
        ORDER BY date("dataRecebida") ASC;
    `;
    const sanitizedData = weekData.map(d => ({...d, totalAmount: Number(d.totalAmount)}));
    return res.json(sanitizedData);
});

// ROTA PARA DADOS DO MÊS (agregado) - AJUSTADA PARA SQLITE
app.get('/data/month', async (req, res) => {
    // CORREÇÃO AQUI: Usando a função date() em minúsculo para SQLite
    const monthData = await prisma.$queryRaw`
        SELECT date("dataRecebida") as date, SUM("mm_de_chuva") as "totalAmount"
        FROM "Leitura"
        WHERE "dataRecebida" >= ${getStartDate('month')}
        GROUP BY date("dataRecebida")
        ORDER BY date("dataRecebida") ASC;
    `;
    const sanitizedData = monthData.map(d => ({...d, totalAmount: Number(d.totalAmount)}));
    return res.json(sanitizedData);
});

// --- FIM DO CÓDIGO PARA O DASHBOARD ---

const PORT = process.env.PORT || 3060;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});