import { describe, it, expect } from "vitest";
import { xai } from "@nakedapi/xai";

describe("xai responses delete", () => {
  it("should expose delete method on delete.v1 namespace", () => {
    const provider = xai({
      apiKey: "sk-test-key",
    });
    expect(typeof provider.delete.v1.responses).toBe("function");
  });
});
