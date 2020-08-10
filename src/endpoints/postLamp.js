const gpio = require('rpi-gpio').promise;
const sleep = require('util').promisify(setTimeout);

const config = require('../../config');

const postLamp = ({ horn, hornDuration }) => async (req, res) => {
  const { defaultDurationInSeconds = 30, lampPin } = config;

  const {
    body: {
      audio = true,
      duration = defaultDurationInSeconds
    } = {}
  } = req;

  try {
    const status = await gpio.read(lampPin);
    if (status) {
      await gpio.write(lampPin, false);
      horn.stop();
      return res.json({ active: false });
    }

    if (audio) {
      horn.play();
      horn.on('complete', async () => {
        await gpio.write(lampPin, false);
      });
    }

    await gpio.write(lampPin, true);
    res.json({ action: true, duration: audio ? hornDuration : duration });

    if (!audio) {
      await sleep(duration * 1000);
      await gpio.write(lampPin, false);
    }
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