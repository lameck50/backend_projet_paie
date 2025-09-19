require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Autoriser toutes les origines (Flutter Web)
app.use(cors({
    origin: '*', 
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinique_paie';

// Connexion MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur connexion MongoDB', err));

// Routes
const authRoutes = require('./routes/auth');
const personnelRoutes = require('./routes/personnel');
const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/payment', paymentRoutes);

// Route test
app.get('/', (req,res)=> res.json({ok:true, message: 'Clinique Paie Backend'}));

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
