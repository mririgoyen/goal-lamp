const restify = require('restify');
const gpio = require('rpi-gpio').promise;

const config = require('../config');
const getLamp = require('./endpoints/getLamp');
const postLamp = require('./endpoints/postLamp');

const server = restify.createServer({ name: 'goallamp' });

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/api/health', (_, res) => res.json({ status: 'OK' }));
server.get('/api/lamp', getLamp);
server.post('/api/lamp', postLamp);

(async () => {
  try {
    await gpio.setup(config.lampPin, gpio.DIR_LOW);   
    server.listen(80, () => console.log('🚨 Goal Lamp server listening on Port 80'));
  } catch (error) {
    console.error(error);
  }
})();

process.on('SIGINT', (_) => {
  gpio.destroy();
  process.exit(1);
});