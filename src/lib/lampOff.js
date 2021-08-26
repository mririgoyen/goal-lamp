const { lampPin } = require('../../config');

const lampOff = async (gpio, mqtt, horn) => {
  await mqtt.publish('goallamp/state', 'OFF');
  await mqtt.publish('goallamp/team', 'None');
  await gpio.write(lampPin, false);

  if (horn) {
    try {
      horn.stop();
    } catch (e) {}
  }
};

module.exports = lampOff;