const express = require('express');
const http = require('http');
const cors = require('cors');
const prisma = require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Arduino está funcionando!' });
});

app.post('/arduinoData', async (req, res) => {
  const { pulsos } = req.body;
  const mm_de_chuva = pulsos * 0.25;

  try {
    const leitura = await prisma.leitura.create({
      data: {
        pulsos,
        mm_de_chuva,
        dataRecebida: new Date()
      }
    });

    console.log('Dados salvos no banco:', leitura);
    res.json({ message: 'Dados recebidos com sucesso', leitura });
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    res.status(500).json({ error: 'Erro ao salvar os dados' });
  }
});

const PORT = process.env.PORT || 3060;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});