const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  module.exports = {
    handleResponse,
  };
  