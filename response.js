const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    payload: {
      status_code: statusCode,
      data: data,
    },
    message: message,
    metadata: {
      prev: "",
      next: "",
      current: "",
    },
  });
};

module.exports = response;
