const gpio = require('rpi-gpio').promise;

const { defaultDurationInSeconds = 30, lampPin } = require('../../config');
const lampOff = require('./lampOff');

const toggleLamp = async ({
  duration = defaultDurationInSeconds,
  horns,
  mqtt,
  state = 'ON',
  team
}) => {
  try {
    const { horn, hornDuration } = horns[team] || {};
    const status = await gpio.read(lampPin);
    if (state === 'OFF' || status) {
      return await lampOff(gpio, mqtt, horn);
    }

    if (horn) {
      horn.play();
      horn.on('complete', async () => await lampOff(gpio, mqtt));
    } else if (duration > 0 || team !== 'none') {
      setTimeout(async () => await lampOff(gpio, mqtt), duration * 1000);
    }

    await gpio.write(lampPin, true);
    await mqtt.publish('goallamp/state', 'ON');

    if (team) {
      await mqtt.publish('goallamp/team', team);
    }

    return { duration: horn ? hornDuration : duration };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = toggleLamp;