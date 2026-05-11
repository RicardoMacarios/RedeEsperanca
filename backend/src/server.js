require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const campanhasRoutes = require('./routes/campanhas');
const ongsRoutes = require('./routes/ongs');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campanhas', campanhasRoutes);
app.use('/api/ongs', ongsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
