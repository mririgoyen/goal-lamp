const teamMiddleware = (availableHorns) => (req, res, next) => {
  const { body: { team } = {} } = req;

  const availableTeams = Object.keys(availableHorns);
  if (!availableTeams.includes(team)) {
    res.status(480);
    res.send({
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'team',
        expected: {
          enum: availableTeams
        },
        in: 'body'
      }
    });
    return;
  }

  next();
};

module.exports = teamMiddleware;