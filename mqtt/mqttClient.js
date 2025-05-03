// mqttClient.js
const mqtt = require('mqtt');
const amqp = require('amqplib');
const { publishToQueues } = require('../rabbitmq/publisher');

const client = mqtt.connect('mqtt://broker.emqx.io:1883');
const topic = '/VIAQ_Test_Employee/TH-MW01test01';

let channel;

async function connectRabbitMQ() {
  const conn = await amqp.connect('amqp://localhost');
  channel = await conn.createChannel();
  await channel.assertQueue('data_saver_queue');
  await channel.assertQueue('notifier_queue');
}

client.on('connect', async () => {
  console.log('✅ MQTT connected (Client)');
  await connectRabbitMQ();
  client.subscribe(topic, () => {
    console.log(`📡 Subscribed to ${topic}`);
  });
});

client.on('message', (topic, message) => {
  if(message.serialNumber) {
  console.log('📥 Received MQTT message:', message.toString());
  }
  // Send to both queues
  publishToQueues(message);
  // channel.sendToQueue('data_saver_queue', Buffer.from(message));
  // channel.sendToQueue('notifier_queue', Buffer.from(message));
  // }
});
