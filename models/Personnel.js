const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <-- ici bcryptjs

const personnelSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  jobTitle: String,
  salary: Number,
  airtelNumber: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['comptable', 'personnel'], default: 'personnel' }
}, { timestamps: true });

personnelSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

personnelSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Personnel', personnelSchema);
