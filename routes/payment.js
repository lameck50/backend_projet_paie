const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// POST /api/payment/airtel => Simuler un paiement et l'enregistrer
router.post('/airtel', async (req, res) => {
  try {
    const { airtelNumber, amount, personnelId, description } = req.body;

    // 1. Simulation de l'appel à l'API d'Airtel
    const simulatedResponse = {
      status: 'SUCCESS',
      providerReference: 'SIM-' + Date.now(),
      airtelNumber,
      amount,
    };

    // 2. Enregistrer la transaction dans la base de données
    const newPayment = new Payment({
      personnelId,
      amount,
      status: simulatedResponse.status,
      providerReference: simulatedResponse.providerReference,
      description,
    });

    await newPayment.save();

    res.json({ ok: true, data: simulatedResponse, message: 'Paiement simulé et enregistré.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/payment/mine => Récupérer les paiements de l'employé connecté
router.get('/mine', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ personnelId: req.user.id }).sort({ createdAt: -1 });
    res.json({ ok: true, list: payments });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
