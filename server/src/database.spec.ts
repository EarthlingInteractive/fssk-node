import { Database } from "./Database";

test("to throw error if config isn't given", () => {
	expect(() => { const db = new Database(); }).toThrow();
});
