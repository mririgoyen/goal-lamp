const { lampPin } = require('../../config');

const lampOff = async (gpio, mqtt, horn) => {
  await mqtt.publish('goallamp/state', 'off');
  await gpio.write(lampPin, false);

  if (horn) {
    try {
      horn.stop();
    } catch (e) {}
  }
};

module.exports = lampOff;