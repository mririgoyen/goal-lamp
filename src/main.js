const path = require('path');
const MQTT = require('async-mqtt');
const restify = require('restify');
const gpio = require('rpi-gpio').promise;
const Sound = require('node-aplay');

const config = require('../config');
const configureHorns = require('./lib/configureHorns');
const mqttConnection = require('./connections/mqtt');

const durationMiddleware = require('./middleware/durationMiddleware');
const teamMiddleware = require('./middleware/teamMiddleware');
const getLamp = require('./endpoints/getLamp');
const postLamp = require('./endpoints/postLamp');

let mqtt = mqttConnection.mock;

(async () => {
  try {
    await gpio.setup(config.lampPin, gpio.DIR_LOW);
    const horns = await configureHorns();

    if (config.mqttServer) {
      mqtt = MQTT.connect(config.mqttServer, { clientId: 'goal-lamp' });
      mqtt.on('connect', mqttConnection.connect(mqtt, horns));
      mqtt.on('message', mqttConnection.message(mqtt, horns));
    }

    const server = restify.createServer({ name: 'goallamp' });
    server.use(restify.plugins.bodyParser());
    server.get('/api/lamp', getLamp);
    server.post('/api/lamp', [ durationMiddleware, teamMiddleware(horns) ], postLamp(horns, mqtt));

    server.listen(80, async () => {
      console.log('🚨 Goal Lamp server listening on Port 80 🚨');
      new Sound(path.resolve(__dirname, './audio/start.wav')).play();
    });
  } catch (error) {
    console.error(error);
  }
})();

process.on('SIGINT', async () => {
  await gpio.destroy();
  await mqtt.end();
  process.exit(1);
});
