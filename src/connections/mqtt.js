const { mqtt: { commandTopic } } = require('../../config');
const toggleLamp = require('../lib/toggleLamp');

const connect = (mqtt) => async () => {
  console.log('🦟 Connected to local MQTT server');
  await mqtt.subscribe(commandTopic);
};

const message = (mqtt, horn) => async (topic, message) => {
  if (topic !== commandTopic) {
    return;
  }
  await toggleLamp({ audio: true, horn, mqtt, state: message.toString() });
};

module.exports = { connect, message };
