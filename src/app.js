const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const connection = require('./db');  // importando a conexão

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Arduino está funcionando!' });
});

app.post('/arduinoData', (req, res) => {
  const { mm_de_chuva, pulsos } = req.body;

  const sql = 'INSERT INTO dados (mm_de_chuva, pulsos) VALUES (?, ?)';
  connection.query(sql, [mm_de_chuva, pulsos], (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).json({ error: 'Erro ao salvar dados' });
    }

    res.json({ message: 'Dados salvos com sucesso!', id: results.insertId });
  });
});

const PORT = process.env.PORT || 3060;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
