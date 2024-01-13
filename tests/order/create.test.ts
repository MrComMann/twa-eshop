import { describe, expect, test } from "@jest/globals";
import { orderService } from "../../src/services";

describe("Placing an order:", () => {
    test("All values right", () => {
        expect(orderService.create("Peter", "ah@g.cz", "The Street 17", 4, 7)).toBe("success");
    });

    test("Wrong product number", () => {
        expect(orderService.create("Peter", "ah@g.cz", "The Street 17", 8216526, 7)).toBe("");
    });
});
