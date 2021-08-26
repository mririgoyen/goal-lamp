const { lampPin } = require('../../config');

const lampOff = async (gpio, mqtt, horns) => {
  await mqtt.publish('goallamp/state', 'off');
  await gpio.write(lampPin, false);

  if (horns) {
    try {
      horns.forEach((horn) => horn.stop());
    } catch (e) {}
  }
};

module.exports = lampOff;