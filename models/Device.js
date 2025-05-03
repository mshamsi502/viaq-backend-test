const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true },
  checkpoints: {
    Temp_Value: { min: Number, max: Number },
    Humi_Value: { min: Number, max: Number }
  },
  lastSaved: {
    temp: { type: Number, required: false, default: null },
    humi: { type: Number, required: false, default: null },
    time: { type: Date }
  } 
}, { strict: true });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
