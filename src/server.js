const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Rota básica para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API Arduino está funcionando!' });
});

// Endpoint para receber dados do Arduino
app.post('/arduinoData', (req, res) => {
  const data = req.body;
  console.log('Dados recebidos do Arduino:', data);
  // Processar os dados recebidos
  res.json({ message: 'Dados recebidos com sucesso' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 