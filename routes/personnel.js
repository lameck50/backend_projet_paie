const express = require('express');
const router = express.Router();
const Personnel = require('../models/Personnel');
const { protect } = require('../middleware/auth');

// GET /api/personnel/me => Récupérer les infos de l'employé connecté
router.get('/me', protect, async (req, res) => {
  try {
    // L'ID de l'utilisateur est dans req.user grâce au middleware protect
    const personnel = await Personnel.findById(req.user.id).select('-password');
    if (!personnel) {
      return res.status(404).json({ ok: false, error: 'Personnel introuvable' });
    }
    res.json({ ok: true, personnel });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/personnel => liste tous les personnels
router.get('/', async (req, res) => {
  try {
    const personnels = await Personnel.find();
    res.json({ ok: true, list: personnels });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/personnel => ajouter un nouveau personnel
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, password, email, jobTitle, salary, airtelNumber } = req.body;
    if (!fullName || !phone || !password) {
      return res.status(400).json({ ok: false, error: 'Nom, téléphone et mot de passe obligatoires' });
    }

    const newPersonnel = new Personnel({
      fullName,
      phone,
      password, // Le mot de passe sera hashé par le pre-save hook du modèle
      email,
      jobTitle,
      salary,
      airtelNumber,
    });

    await newPersonnel.save();
    res.json({ ok: true, personnel: newPersonnel });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// PUT /api/personnel/:id => modifier un personnel existant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, password, email, jobTitle, salary, airtelNumber } = req.body;

    const updatedData = { fullName, phone, email, jobTitle, salary, airtelNumber };

    // Si un nouveau mot de passe est fourni, il sera hashé par le middleware
    if (password) {
      const personnel = await Personnel.findById(id);
      if (!personnel) return res.status(404).json({ ok: false, error: 'Personnel introuvable' });
      personnel.password = password;
      await personnel.save(); // Le hook pre-save s'appliquera
    }

    const updatedPersonnel = await Personnel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPersonnel) return res.status(404).json({ ok: false, error: 'Personnel introuvable' });

    res.json({ ok: true, personnel: updatedPersonnel });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// DELETE /api/personnel/:id => supprimer un personnel
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPersonnel = await Personnel.findByIdAndDelete(id);
    if (!deletedPersonnel) return res.status(404).json({ ok: false, error: 'Personnel introuvable' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
