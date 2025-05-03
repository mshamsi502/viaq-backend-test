const mqtt = require('mqtt');
const {
  getRandomInRange
} = require('../helper/helper');


async function DataGenerator() {
  const client = mqtt.connect('mqtt://broker.emqx.io:1883');

  client.on('connect', () => {
    console.log('🧩 [Generator] : ✅ MQTT connected');

    const count = 50;
    let number = 1;

    const publishNext = () => {
      if (number > count) {
        client.end();
        return;
      }

      const payload = JSON.stringify({
        serialNumber: `TH-MW01test${number}`,
        Temp_Value: parseFloat(getRandomInRange(0, 50).toFixed(2)),
        Humi_Value: parseFloat(getRandomInRange(0, 100).toFixed(2)),
      });

      client.publish('/VIAQ_Test_Employee/TH-MW01test01', payload, () => {
        console.log(`🧩 [Generator] : 📤 Message ${number} published`);
        number++;
        setTimeout(publishNext, 100);
      });
    };

    publishNext();
  });
}

module.exports = DataGenerator;

if (require.main === module) {
  DataGenerator();
}