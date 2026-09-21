// Runs when no route matches the URL the user asked for
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Runs whenever an error happens anywhere in our backend
const errorHandler = (err, req, res, next) => {
  // If no error status was set yet, use 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send the error message back as JSON
  res.status(statusCode).json({
    message: err.message,
  });
};

// Export both functions so server.js can use them
module.exports = { notFound, errorHandler };