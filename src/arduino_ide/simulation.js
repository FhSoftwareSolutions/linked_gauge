const axios = require('axios');
const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Array para armazenar os dados recebidos
const dadosRecebidos = [];

// Rota básica para verificar se a API está funcionando
app.get('/', (req, res) => {
  // Exibe os dados armazenados
  res.json({
    message: 'API Arduino está funcionando!',
    dados: dadosRecebidos
  });
});

// Endpoint para receber dados do Arduino (ou do script de simulação)
app.post('/arduinoData', (req, res) => {
  const data = req.body;
  console.log('Dados recebidos do Arduino:', data);
  
  // Armazena o dado recebido no array
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

// Defina a URL da API (ajuste para o localHost ser o IP de sua máquina)
const url = 'http://localhost:3060/arduinoData';

// Variável para simular os pulsos
let pulsos = 0;

// Função para simular a medição do pluviômetro
function simularMedicao() {
  // Simula um incremento aleatório de pulsos (por exemplo, entre 1 e 5 pulsos)
  const incremento = Math.floor(Math.random() * 5) + 1;
  pulsos += incremento;
  const mmDeChuva = (pulsos * 0.25).toFixed(2);
  
  // Monta o JSON conforme o esperado pela API
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

// Configura o script para enviar uma medição a cada 5 segundos
setInterval(simularMedicao, 5000);
