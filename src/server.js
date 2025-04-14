const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Arduino está funcionando!' });
});

app.post('/arduinoData', (req, res) => {
  const data = req.body;
  console.log('Dados recebidos do Arduino:', data);

  dadosRecebidos.push({
    dataRecebida: new Date(),
    ...data
  });

  res.json({ message: 'Dados recebidos com sucesso', data });
});

const PORT = process.env.PORT || 3060;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const dadosRecebidos = [];