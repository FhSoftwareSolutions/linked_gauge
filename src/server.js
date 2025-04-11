const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Rota básica para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API Arduino está funcionando!' });
});

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log('Novo dispositivo conectado');

  socket.on('arduinoData', (data) => {
    console.log('Dados recebidos do Arduino:', data);
    // Aqui você pode processar os dados recebidos
    // e enviar para outros clientes conectados se necessário
    io.emit('dataUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Dispositivo desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 