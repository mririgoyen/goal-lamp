const toggleLamp = require('../lib/toggleLamp');

const connect = (mqtt) => async () => {
  console.log('🦟 Connected to local MQTT server');
  return mqtt.subscribe('goallamp/set');
};

const message = (mqtt, horns) => async (topic, message) => {
  const [ domain, command ] = topic.split('/');

  if (domain !== 'goallamp' || domain === 'goallamp' && command !== 'set') {
    return;
  }

  console.log({ message });

  const duration = message === 'on' ? 0 : undefined;
  await toggleLamp({ audio: true, duration, horns, mqtt, state: message });
};

const mock = {
  end: async () => {},
  publish: async () => {}
};

module.exports = { connect, message, mock };
