const gpio = require('rpi-gpio').promise;

const config = require('../../config');

const getLamp = async (_, res) => {
  try {
    const status = await gpio.read(config.lampPin);
    res.json({ active: status });
  } catch (error) {
    res.status(580);
    res.send({
      errorCode: 'InternalError',
      message: error
    });
  }
};

module.exports = getLamp;