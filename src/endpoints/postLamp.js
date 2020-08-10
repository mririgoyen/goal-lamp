const gpio = require('rpi-gpio').promise;
const sleep = require('util').promisify(setTimeout);

const toggleLamp = require('../lib/toggleLamp');

const postLamp = (horn, mqtt) => async (req, res) => {
  const { body: { audio = true, duration } = {} } = req;

  try {
    const lamp = await toggleLamp({ audio, duration, horn, mqtt });
    res.json({ active: !!duration, lamp });
  } catch (error) {
    console.error(error);
    res.status(580);
    res.send({
      errorCode: 'InternalError',
      message: error
    });
  }
};

module.exports = postLamp;