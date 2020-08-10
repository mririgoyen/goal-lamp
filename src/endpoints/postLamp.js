const gpio = require('rpi-gpio').promise;
const sleep = require('util').promisify(setTimeout);

const config = require('../../config');

const postLamp = async (req, res) => {
  try {
    const { defaultDurationInSeconds, lampPin } = config;

    const status = await gpio.read(lampPin);
    if (status) {
      await gpio.write(lampPin, false);
      return res.json({ active: false });
    }

    await gpio.write(lampPin, true);
    res.json({ action: true, duration: defaultDurationInSeconds });

    // TODO: Turn lamp on for duration of audio clip
    await sleep(defaultDurationInSeconds * 1000);
    await gpio.write(lampPin, false);
    return;
  } catch (error) {
    res.status(580);
    res.send({
      errorCode: 'InternalError',
      message: error
    });
  }
};

module.exports = postLamp;