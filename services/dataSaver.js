const amqp = require('amqplib');
const Device = require('../models/Device');
const {
  DEVICE_CHECKPOINTS
} = require('../constants/deviceCheckPoints');

const queueName = 'data_saver_queue';

async function startDataSaver() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true
    });
    console.log(`🧩 [dataSaver] : 📥 [Saver] Waiting for messages in "${queueName}"`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        if (payload && payload.serialNumber) {
          const {
            serialNumber,
            Temp_Value,
            Humi_Value
          } = payload;
          console.log('🧩 [dataSaver] : Received payload:', payload);

          await Device.findOneAndUpdate({
            serialNumber: serialNumber
          }, {
            $set: {
              serialNumber: serialNumber,
              checkpoints: DEVICE_CHECKPOINTS,
              lastSaved: {
                temp: Temp_Value,
                humi: Humi_Value,
                time: new Date(),
              }
            }
          }, {
            upsert: true,
            new: true
          });

          console.log(`🧩 [dataSaver] : ✅ Saved data for ${serialNumber}`);
        }
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('🧩 [dataSaver] : ❌ Error:', error);
  }
}

module.exports = startDataSaver;