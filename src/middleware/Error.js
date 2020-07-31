module.exports = {
  // eslint-disable-next-line no-unused-vars
  errorHandler: (error, request, response, next) => {
    const statusCode = response.statusCode !== 200 ? response.statusCode : 500;
    response.status(statusCode).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
    console.error(`Error: ${error.message}`);
  },
};
