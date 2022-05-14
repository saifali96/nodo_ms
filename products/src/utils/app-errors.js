const STATUS_CODES = {
	OK: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500,
}

class BadRequestError extends Error {
	constructor(error) {
		super(error.message);
		this.data = { error };
		this.description = "Bad Request."
		this.statusCode = STATUS_CODES.BAD_REQUEST;
	}
}
class APIError extends Error {
	constructor(error, log) {
		super(error.message);
		this.data = { error, log };
		this.description = "API Error"
		this.statusCode = STATUS_CODES.BAD_REQUEST;
	}
}


module.exports = {
	APIError,
	BadRequestError,
	STATUS_CODES
}
