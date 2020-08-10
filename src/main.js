const path = require('path');
const restify = require('restify');
const gpio = require('rpi-gpio').promise;
const Sound = require('node-aplay');
const wavFileInfo = require('util').promisify(require('wav-file-info').infoByFilename);

const config = require('../config');
const durationMiddleware = require('./middleware/durationMiddleware');
const getLamp = require('./endpoints/getLamp');
const postLamp = require('./endpoints/postLamp');

const server = restify.createServer({ name: 'goallamp' });
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const configureAudio = async () => {
  try {
    const soundPath = path.resolve(__dirname, './audio/goal.wav');
    const horn = new Sound(soundPath);
    const { duration } = await wavFileInfo(soundPath);
    return {
      horn,
      hornDuration: Math.ceil(duration)
    };
  } catch (error) {
    console.log(`[ERROR] ${error}`);
    process.exit(1);
  }
};

(async () => {
  try {
    await gpio.setup(config.lampPin, gpio.DIR_LOW);
    const audio = await configureAudio();

    server.get('/api/health', (_, res) => res.json({ status: 'OK' }));
    server.get('/api/lamp', getLamp);
    server.post('/api/lamp', [ durationMiddleware ], postLamp(audio));

    server.listen(80, () => {
      console.log('🚨 Goal Lamp server listening on Port 80');
      new Sound(path.resolve(__dirname, './audio/start.wav')).play();
    });
  } catch (error) {
    console.error(error);
  }
})();

process.on('SIGINT', (_) => {
  gpio.destroy();
  process.exit(1);
});