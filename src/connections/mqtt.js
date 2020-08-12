const toggleLamp = require('../lib/toggleLamp');

const connect = (mqtt, horns) => async () => {
  console.log('🦟 Connected to local MQTT server');
  const subscriptions = Object.keys(horns).map((team) => mqtt.subscribe(`goallamp/${team}/set`));
  return Promise.all(subscriptions);
};

const message = (mqtt, horns) => async (topic, message) => {
  const [ domain, team, command ] = topic.split('/');

  if (domain !== 'goallamp' || domain === 'goallamp' && command !== 'set') {
    return;
  }

  await toggleLamp({ audio: true, horns, mqtt, state: message.toString(), team });
};

const mock = {
  end: async () => {},
  publish: async () => {}
};

module.exports = { connect, message, mock };
