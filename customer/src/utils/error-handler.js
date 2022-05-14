const { createLogger, transports } = require('winston');


const LogErrors = createLogger({
	transports: [
	  new transports.Console(),
	  new transports.File({ filename: 'app_error.log' })
	]
  });
	

class ErrorLogger {
	constructor(){}
	async logError(err){
		console.log('==================== Start Error Logger ===============');
		LogErrors.log({
			private: true,
			level: 'error',
			message: `${new Date()}-${JSON.stringify(err)}`
		  });
		console.log('==================== End Error Logger ===============');
		// log error with Logger plugins
	  
		return false;
	}

}

const ErrorHandler = async (err, req, res, next) => {
	
	const errorLogger = new ErrorLogger();

	process.on('uncaughtException', (reason, promise) => {
		console.log(reason, 'UNHANDLED');
		throw reason; // need to take care
	})

	process.on('uncaughtException', (error) => {
		errorLogger.logError(error);
		// TODO - Handle uncaughtExceptions gracefully

	})
	
	if(err){
		await errorLogger.logError(err);
		// TODO - Restart gracefully on special errors.

		if(JSON.stringify(err.data.log) !== "{}") {
			return res.status(err.statusCode).json({ success: false, message: err.data.log });
		}
		return res.status(err.statusCode).json({ success: false, message: err })
	}
	next();
}

module.exports = ErrorHandler;