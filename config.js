module.exports = {
  defaultDurationInSeconds: 10,
  lampPin: 7,
  mqtt: {
    commandTopic: 'goallamp/set',
    stateTopic: 'goallamp/state'
  }
};