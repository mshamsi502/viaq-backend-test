require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const {
  connectRabbitMQ
} = require('./rabbitmq/connection');
require('./mqtt/mqttClient');

const routes = require('./api/routes');
const consumeSaveToDB = require('./consumers/deviceConsumer');
const consumeCheckAndNotify = require('./consumers/notificationConsumer');
const consumeDataSaver = require('./consumers/dataSaverConsumer');
const DataGenerator = require('./generator/data-generator');

const app = express();
const port = process.env.PORT || 3000;
const mode = process.env.MODE;
// const mode = process.env.MODE || 'server';

app.use(express.json());
app.use(routes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

//
connectRabbitMQ();
//
connectRabbitMQ().then(async () => {
  console.log('------------- MODE : ', mode);
  if (mode.toString().includes('consumer')) {
    console.log('--- MODE includes Running Consumers..');
    await consumeSaveToDB();
    await consumeCheckAndNotify();
    await consumeDataSaver();
  }
  if (mode.toString().includes('generator')) {
    console.log('--- MODE includes Running Data Generator..');

    await DataGenerator();
  }
});