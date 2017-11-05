export default class ValidationError extends Error {
	public static types = {
		INVALID_FORMAT: 'INVALID_FORMAT',
		MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
		VALUE_MUST_BE_UNIQUE: 'VALUE_MUST_BE_UNIQUE',
	};

	public statusCode: number;
	public validationType: string;
	public fields: string;

	public constructor(type: string, fields: string) {
		super('validation error');

		this.validationType = type;
		this.fields = fields;
	}
}
