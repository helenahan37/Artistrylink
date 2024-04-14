// handel all errors
const globalErrorHandler = (err, req, res, next) => {
	const stack = err?.stack;
	const statusCode = err?.statusCode ? err?.statusCode : 500;
	const message = err?.message;

	if (err.code === 11000) {
		message = 'The provided username or email is already in use.';
		statusCode = 400;
	}

	res.status(statusCode).json({
		stack,
		message,
	});
};

//404 handler
const notFound = (req, res, next) => {
	const err = new Error(`Route ${req.originalUrl} not found`);
	next(err);
};

module.exports = { notFound, globalErrorHandler };
