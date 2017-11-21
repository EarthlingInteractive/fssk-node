
	/**
		* Takes an array of required keys on data, returns an array of the the keys that are missing data
		* @param string[] requiredFields
		* @param {} data
		* @returns string[] array of empty required fields
		*/
export function checkRequiredFields(requiredFields: string[], data: any) {
	const missingRequiredFields: string[] = [];

	requiredFields.forEach((field) => {
		if (!data[field] && data[field] !== false) { missingRequiredFields.push(field); }
	});

	return missingRequiredFields;
}
