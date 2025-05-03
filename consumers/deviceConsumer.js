const { getChannel } = require('../rabbitmq/connection');
const Device = require('../models/Device');
const { DEVICE_CHECKPOINTS }  = require('../constants/deviceCheckPoints');

async function consumeSaveToDB() {
  console.log("🧩 [dataSaver] : Starting Device Consumer...");

  const channel = getChannel();
  if (!channel) return;

  channel.consume('data_saver_queue', async (msg) => {

    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString());

        if (data.serialNumber) {
          await Device.findOneAndUpdate(
            { serialNumber: data.serialNumber },
            {
              $set: {
                serialNumber: data.serialNumber,
                checkpoints: DEVICE_CHECKPOINTS,
                lastSaved: {
                  temp: data?.Temp_Value,
                  humi: data?.Humi_Value,
                  time: new Date(),
                },
              },
            },
            { upsert: true, new: true }
          );
          console.log(`🧩 [device] : ✅ Device data saved for serial: ${data.serialNumber}`);
        } else {
          // console.log('🧩 [device] : ❌ Missing serialNumber in data');
        }

        channel.ack(msg); 
      } catch (err) {
        console.error('🧩 [device] : ❌ Error processing message:', err.message);
        channel.nack(msg);
      }
    }
  });
}

module.exports = consumeSaveToDB;

if (require.main === module) {
  consumeSaveToDB();
}