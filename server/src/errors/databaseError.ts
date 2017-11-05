export default class DatabaseError extends Error {
	public statusCode: number = 500;
}

/**
 * Takes an error and throws a DatabaseError
 * @param {*} error
 * @throws DatabaseError
 */
export function handleDatabaseErrors(error: {}) {
	console.error(error);
	throw new DatabaseError(error.toString());
}
