const gpio = require('rpi-gpio').promise;
const sleep = require('util').promisify(setTimeout);

const lampOff = require('./lampOff');

const {
  defaultDurationInSeconds = 30,
  lampPin,
  mqtt: { stateTopic }
} = require('../../config');

const toggleLamp = async ({
  audio = true,
  duration = defaultDurationInSeconds,
  horn: { hornDuration, horn },
  mqtt,
  state = 'ON'
}) => {
  try {
    const status = await gpio.read(lampPin);
    if (state === 'OFF' || status) {
      return await lampOff(gpio, mqtt, horn);
    }

    if (audio) {
      horn.play();
      horn.on('complete', async () => await lampOff(gpio, mqtt));
    } else {
      setTimeout(async () => await lampOff(gpio, mqtt), duration * 1000);
    }

    await gpio.write(lampPin, true);
    await mqtt.publish(stateTopic, 'ON');
    return { duration: audio ? hornDuration : duration };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = toggleLamp;