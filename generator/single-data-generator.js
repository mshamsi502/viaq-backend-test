const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.emqx.io:1883');

const topic = '/VIAQ_Test_Employee/TH-MW01test01';

async function SingleDataGenerator() {

  client.on('connect', () => {
    const payload = {
      serialNumber: 'TH-MW01test01',
      Temp_Value: 10,
      Humi_Value: 46,
    };

    client.publish(topic, JSON.stringify(payload), () => {
      console.log('🧩 [Single Generator] : 📤 Test payload published : ', payload);
      client.end();
    });
  });
}


module.exports = SingleDataGenerator;

if (require.main === module) {
  SingleDataGenerator();
}