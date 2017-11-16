/**
 * Takes an error and throws an Error
 * @param {*} error
 * @throws Error
 */
export default function handleDatabaseErrors(error: any) {
	console.error(error);
	throw new Error(error);
}
