import { describe, expect, test } from "@jest/globals";
import { adminService } from "../../src/services";

describe("Adding user:", () => {
    test("Existing user", () => {
        expect(adminService.addUser("admin1")).toBe("");
    });

    test("New user", () => {
        expect(adminService.addUser(Date.now() + "Test")).toHaveLength(12);
    });
});
