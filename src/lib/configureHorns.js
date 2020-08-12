const path = require('path');
const fs = require('fs').promises;
const Sound = require('node-aplay');
const wavFileInfo = require('util').promisify(require('wav-file-info').infoByFilename);

const configureHorns = async () => {
  const hornFiles = await fs.readdir(path.resolve(__dirname, '../audio/teams'));

  return await hornFiles.reduce(async (previousPromise, file) => {
    const output = await previousPromise;

    if (path.extname(file) !== '.wav') {
      return output;
    }

    const team = path.basename(file, '.wav');
    const filepath = path.resolve(__dirname, `../audio/teams/${team}.wav`);
    const horn = new Sound(filepath);
    const { duration } = await wavFileInfo(filepath);
    output[team] = { horn, hornDuration: Math.ceil(duration) };
    return output;
  }, Promise.resolve({}));
};

module.exports = configureHorns;