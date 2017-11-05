export default class AuthenticationError extends Error {
	public statusCode: number = 401;

	public constructor(message?: string) {
		super(message || 'authentication error');
	}
}
