const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  personnelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personnel',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'PENDING', 'FAILED'],
    required: true,
  },
  providerReference: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
