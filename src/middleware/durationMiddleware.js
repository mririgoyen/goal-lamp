const durationMiddleware = (req, res, next) => {
  const { body: { duration } = {} } = req;

  if (!duration) {
    next();
  }

  if (!Number(duration)) {
    res.status(480);
    res.send({
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'duration',
        expected: {
          type: 'number'
        },
        in: 'body'
      }
    });
    return;
  }

  req.body.duration = Math.ceil(Number(duration));

  next();
};

module.exports = durationMiddleware;