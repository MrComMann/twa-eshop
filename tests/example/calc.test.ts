import { describe, expect, test } from "@jest/globals";
import { exampleService } from "../../src/services";

describe("Example calc", () => {
  test("1 + 1 = 2", () => {
    expect(exampleService.calc(1, 1, "+")).toBe(2);
  });

  test("1 / 0 = unable", () => {
    expect(exampleService.calc(1, 0, "/")).toBe(false);
  });
});
