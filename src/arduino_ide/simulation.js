const axios = require('axios');
const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const dadosRecebidos = [];

app.get('/', (req, res) => {
  res.json({
    message: 'API Arduino está funcionando!',
    dados: dadosRecebidos
  });
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const url = 'http://localhost:3060/arduinoData';

let pulsos = 0;

function simularMedicao() {
  const incremento = Math.floor(Math.random() * 5) + 1;
  pulsos += incremento;
  const mmDeChuva = (pulsos * 0.25).toFixed(2);

  const dados = {
    pulsos: pulsos,
    mm_de_chuva: mmDeChuva
  };

  console.log('Enviando dados:', dados);

  axios.post(url, dados)
    .then(response => {
      console.log('Resposta da API:', response.data);
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error.message);
    });
}

setInterval(simularMedicao, 5000);
