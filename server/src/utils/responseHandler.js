const handleResponse = (res, statusCode, message, data) => {
  const response = {
      success: true,
      message,
  };

  // Add data key only if it is not null or undefined
  if (data !== null && data !== undefined) {
      response.data = data;
  }

  res.status(statusCode || 200).json(response);
};

module.exports = {
  handleResponse,
};
