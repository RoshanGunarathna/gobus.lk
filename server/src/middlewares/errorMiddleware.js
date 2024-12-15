const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
    console.error(err.message || "Server Error");
    res.status(statusCode).json({ message: err.message || "Server Error",  success: false,});
  };
  
module.exports = errorMiddleware;
