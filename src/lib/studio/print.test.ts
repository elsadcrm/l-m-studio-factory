import { describe, expect, it } from "vitest";
import { checkResolution, coverTemplate, placementBox, PRINTERS } from "./print";

const a4Bleed = placementBox({
  format: { kind: "a4", widthMm: 210, heightMm: 297 },
  bleedMm: 3.175,
  safeMarginMm: 6.35,
  placement: "fond_perdu",
});

describe("résolution effective", () => {
  it("2550×3508 px sur A4 + fond perdu n'atteint pas 300 ppp", () => {
    const r = checkResolution(2550, 3508, a4Bleed);
    expect(r.effectiveDpi).toBeLessThan(300);
  });
  it("2556×3583 px sur A4 + fond perdu atteint 300 ppp", () => {
    expect(checkResolution(2556, 3583, a4Bleed).level).toBe("ok");
  });
  it("1024×1024 px sur A4 est insuffisante (< 200 ppp)", () => {
    expect(checkResolution(1024, 1024, a4Bleed).level).toBe("insuffisante");
  });
  it("ignore la proportion : une image carrée sur A4 est limitée par sa largeur", () => {
    const r = checkResolution(3000, 3000, a4Bleed);
    expect(r.effectiveDpi).toBe(Math.floor(3000 / (216.35 / 25.4)));
  });
});

describe("couverture", () => {
  it("n'est jamais conforme avec un profil non vérifié", () => {
    const c = coverTemplate({ format: { kind: "a4", widthMm: 210, heightMm: 297 }, pageCount: 40 }, PRINTERS[0], "blanc");
    expect(c.conforme).toBe(false);
    expect(c.spineMm).toBeCloseTo(2.29, 2);
  });
});
