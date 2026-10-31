import { describe, expect, it } from "vitest";
import { toWhatsAppNumber } from "./contact";

describe("toWhatsAppNumber", () => {
  it("turns a local Indonesian number into international form", () => {
    expect(toWhatsAppNumber("087777218664")).toBe("6287777218664");
  });

  it("strips formatting and keeps an existing country code", () => {
    expect(toWhatsAppNumber("+62 877-7721-8664")).toBe("6287777218664");
  });
});
