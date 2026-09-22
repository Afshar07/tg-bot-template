import { describe, expect, it } from "vitest";
import healthHandler from "~/server/routes/health.get.ts";

describe("GET /health", () => {
  it("returns the service status", () => {
    expect(healthHandler({} as never)).toEqual({ status: "ok" });
  });
});
