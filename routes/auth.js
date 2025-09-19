const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Personnel = require('../models/Personnel');

router.post('/register', async (req,res)=>{
  try{
    const {name,email,password,role} = req.body;
    const user = new User({name,email,password,role});
    await user.save();
    res.json({ok:true, user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(err){
    console.error(err);
    res.status(400).json({ok:false, error: err.message});
  }
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({ok:false, error:'Invalid credentials'});
    const match = await user.comparePassword(password);
    if(!match) return res.status(400).json({ok:false, error:'Invalid credentials'});
    const token = jwt.sign({id:user._id, role:user.role, name:user.name}, process.env.JWT_SECRET || 'secret', {expiresIn: '7d'});
    res.json({ok:true, token});
  }catch(err){
    console.error(err);
    res.status(500).json({ok:false, error:err.message});
  }
});

// Connexion pour le personnel
router.post('/personnel/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ ok: false, error: 'Téléphone et mot de passe obligatoires' });
    }

    const personnel = await Personnel.findOne({ phone });
    if (!personnel || !personnel.password) { // Ajout de la vérification de mot de passe
      return res.status(400).json({ ok: false, error: 'Identifiants invalides ou compte non configuré pour la connexion' });
    }

    const match = await personnel.comparePassword(password);
    if (!match) {
      return res.status(400).json({ ok: false, error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: personnel._id, role: personnel.role, name: personnel.fullName },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ ok: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
