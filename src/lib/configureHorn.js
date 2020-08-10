const path = require('path');
const Sound = require('node-aplay');
const wavFileInfo = require('util').promisify(require('wav-file-info').infoByFilename);

const configureHorn = async () => {
  const soundPath = path.resolve(__dirname, '../audio/goal.wav');
  const horn = new Sound(soundPath);
  const { duration } = await wavFileInfo(soundPath);
  return {
    horn,
    hornDuration: Math.ceil(duration)
  };
};

module.exports = configureHorn;