const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();

    await channel.assertQueue('save_to_db');
    await channel.assertQueue('check_and_notify');

    console.log('✅ Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ RabbitMQ connection error:', err.message);
  }
}

function getChannel() {
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel,
};
