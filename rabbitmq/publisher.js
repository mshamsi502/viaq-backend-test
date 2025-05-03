const { getChannel } = require('./connection');

async function publishToQueues(message) {
  const channel = getChannel();
  if (!channel) return;
  try {
    channel.sendToQueue('data_saver_queue', Buffer.from(message));
    channel.sendToQueue('notifier_queue',  Buffer.from(message));
   
    channel.sendToQueue('save_to_db', Buffer.from(message));
    channel.sendToQueue('check_and_notify', Buffer.from(message));
  } catch (err) {
    console.error('❌ Failed to publish:', err.message);
  }
}

module.exports = { publishToQueues };
