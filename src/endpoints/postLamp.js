const toggleLamp = require('../lib/toggleLamp');

const postLamp = (horns, mqtt) => async (req, res) => {
  const { body: { duration, team } = {} } = req;

  try {
    const lamp = await toggleLamp({ duration, horns, mqtt, team });
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