const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Erro MongoDB:', err));

// Importar rotas
const authRoutes = require('./src/routes/auth');
const codeRoutes = require('./src/routes/code');
const gamepassRoutes = require('./src/routes/gamepass');
const paymentRoutes = require('./src/routes/payment');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/gamepass', gamepassRoutes);
app.use('/api/payment', paymentRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'LAG TECK API funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
