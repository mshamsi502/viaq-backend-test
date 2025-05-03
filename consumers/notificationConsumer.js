const { getChannel } = require('../rabbitmq/connection');
const Device = require('../models/Device');
const Notification = require('../models/Notification');

async function consumeCheckAndNotify() {
  console.log("🧩 [Notification] : Starting Notification Consumer...");

  const channel = getChannel();
  if (!channel) return;

  channel.consume('notifier_queue', async (msg) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString());
        if (data.serialNumber) {
        const device = await Device.findOne({ serialNumber: data.serialNumber });
        if (!device) {
          console.log(`🧩 [Notification] : ❌ Device not found for serial: ${data.serialNumber}`);
          channel.ack(msg);
          return;
        }

        const notifications = [];

        if (data.Temp_Value < device.checkpoints.Temp_Value.min || data.Temp_Value > device.checkpoints.Temp_Value.max) {
          notifications.push({
            deviceId: device._id,
            parameter: 'Temp_Value',
            value: data.Temp_Value,
          });
        }

        if (data.Humi_Value < device.checkpoints.Humi_Value.min || data.Humi_Value > device.checkpoints.Humi_Value.max) {
          notifications.push({
            deviceId: device._id,
            parameter: 'Humi_Value',
            value: data.Humi_Value,
          });
        }

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
          console.log(`🧩 [Notification] : ✅ Notifications saved for device: ${data.serialNumber}`);
        }
      }
        channel.ack(msg); 
      } catch (err) {
        console.error('🧩 [Notification] : ❌ Error processing message:', err.message);
        channel.nack(msg);
      }
    }
  });
}


module.exports = consumeCheckAndNotify;

if (require.main === module) {
  consumeCheckAndNotify();
}