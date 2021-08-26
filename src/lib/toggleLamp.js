const gpio = require('rpi-gpio').promise;

const { defaultDurationInSeconds = 30, lampPin } = require('../../config');
const lampOff = require('./lampOff');

const toggleLamp = async ({
  duration,
  horns,
  mqtt,
  state = 'on'
}) => {
  try {
    const overrideDuration = duration >= 0 ? duration : defaultDurationInSeconds;
    const { horn, hornDuration } = horns[state] || {};
    const status = await gpio.read(lampPin);
    if (state === 'off' || status) {
      return await lampOff(gpio, mqtt, horn);
    }

    if (horn) {
      horn.play();
      horn.on('complete', async () => await lampOff(gpio, mqtt));
    } else if (overrideDuration > 0) {
      setTimeout(async () => await lampOff(gpio, mqtt), overrideDuration * 1000);
    }

    await gpio.write(lampPin, true);
    await mqtt.publish('goallamp/state', state);

    return { duration: horn ? hornDuration : overrideDuration };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = toggleLamp;