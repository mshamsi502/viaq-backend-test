require('dotenv').config();
const mongoose = require('mongoose');
const startDataSaver = require('../services/dataSaver');

async function consumeDataSaver() {
  console.log("🧩 [dataSaver] : Starting DataSaver Consumer...");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🧩 [dataSaver] : ✅ MongoDB connected (Saver)');
  startDataSaver();
}).catch((err) => {
  console.error('🧩 [dataSaver] : ❌ MongoDB connection error:', err);
});
}


module.exports = consumeDataSaver;

if (require.main === module) {
  consumeDataSaver();
}