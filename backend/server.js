require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log("MONGODB_URI =", process.env.MONGODB_URI);
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão MongoDB
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB conectado com sucesso'))
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });

// Rota para a Raiz (Evita o "Rota não encontrada" ao acessar a URL principal)
app.get('/', (req, res) => {
  res.json({ msg: 'API rodando com sucesso e conectada ao banco!' });
});

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/photos', require('./routes/photo.routes'));
app.use('/api/curriculum', require('./routes/curriculum.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ msg: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});