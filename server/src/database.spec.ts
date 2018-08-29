import { Database } from "./database";

test("to throw error if config isn't given", () => {
	expect(() => { const db = new Database(); }).toThrow();
});
