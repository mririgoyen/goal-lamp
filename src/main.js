const path = require('path');
const MQTT = require('async-mqtt');
const restify = require('restify');
const gpio = require('rpi-gpio').promise;
const Sound = require('node-aplay');

const config = require('../config');
const configureHorn = require('./lib/configureHorn');
const mqttConnection = require('./connections/mqtt');

const durationMiddleware = require('./middleware/durationMiddleware');
const getLamp = require('./endpoints/getLamp');
const postLamp = require('./endpoints/postLamp');

(async () => {
  try {
    await gpio.setup(config.lampPin, gpio.DIR_LOW);
    const audio = await configureHorn();

    const mqtt = MQTT.connect('tcp://192.168.1.210:1883', { clientId: 'goal-lamp' });
    mqtt.on('connect', mqttConnection.connect(mqtt));
    mqtt.on('message', mqttConnection.message(mqtt, audio));

    const server = restify.createServer({ name: 'goallamp' });
    server.use(restify.plugins.bodyParser());
    server.get('/api/lamp', getLamp);
    server.post('/api/lamp', [ durationMiddleware ], postLamp(audio, mqtt));

    server.listen(80, async () => {
      console.log('🚨 Goal Lamp server listening on Port 80');
      new Sound(path.resolve(__dirname, './audio/start.wav')).play();
    });
  } catch (error) {
    console.error(error);
  }
})();

process.on('SIGINT', async (_) => {
  await gpio.destroy();
  await mqtt.end();
  process.exit(1);
});
