import { describe, expect, it } from "vitest";
import { formatKst } from "./format";

describe("formatKst", () => {
  it("UTC 시각을 한국 시간 YYYY.MM.DD HH:mm으로 보여 준다", () => {
    expect(formatKst(new Date("2026-09-30T06:02:00Z"))).toBe("2026.09.30 15:02");
  });

  it("날짜가 넘어가는 시각도 한국 날짜로 보여 준다", () => {
    expect(formatKst(new Date("2026-09-30T15:30:00Z"))).toBe("2026.10.01 00:30");
  });
});
