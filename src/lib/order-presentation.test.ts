import { describe, expect, it } from "vitest";
import { elapsedTone, formatElapsed, getOrderAge, summarizeOrderItems } from "./order-presentation";
import type { Order } from "../types";
const base: Order = {
  id: "a",
  cartId: "c",
  receiptNumber: "123",
  tableNumber: "18",
  productId: "p",
  productName: "ソーダ",
  productImageUrl: "/x.png",
  category: "original_cocktail",
  recipe: "ソーダ 100ml",
  orderedBy: "u",
  ordererName: "テスト",
  status: "pending",
  createdAt: "2026-09-04T12:00:00Z",
  updatedAt: "2026-09-04T12:00:00Z",
};
describe("注文票表示", () => {
  it("同じ商品を数量表示し、異なるレシピを混ぜない", () => {
    const lines = summarizeOrderItems([
      base,
      { ...base, id: "b" },
      { ...base, id: "c", recipe: "別のレシピ" },
    ]);
    expect(lines.map((l) => l.quantity)).toEqual([2, 1]);
  });
  it("同じ商品IDでもホットとアイスを別の商品行にする", () => {
    const lines = summarizeOrderItems([
      { ...base, id: "hot-1", productName: "抹茶ラテ（ホット）" },
      { ...base, id: "iced", productName: "抹茶ラテ（アイス）" },
      { ...base, id: "hot-2", productName: "抹茶ラテ（ホット）" },
    ]);
    expect(lines.map((line) => [line.order.productName, line.quantity])).toEqual([
      ["抹茶ラテ（ホット）", 2],
      ["抹茶ラテ（アイス）", 1],
    ]);
  });
  it("5分・10分の境界だけ警告し、30秒以内はNEW", () => {
    const start = Date.parse(base.createdAt);
    expect(getOrderAge(base.createdAt, start + 20_000).isNew).toBe(true);
    expect(getOrderAge(base.createdAt, start + 300_000).level).toBe("waiting");
    expect(getOrderAge(base.createdAt, start + 600_000).level).toBe("late");
    expect(getOrderAge(base.createdAt, start + 60_000).label).toBe("1分経過");
  });
});

describe("経過時間表示", () => {
  const placed = "2026-09-04T12:00:00Z";
  const at = (seconds: number) => Date.parse(placed) + seconds * 1000;

  it("mm:ss で表示し、1時間を超えたら時間も表示する", () => {
    expect(formatElapsed(placed, at(65))).toBe("01:05");
    expect(formatElapsed(placed, at(3725))).toBe("01:02:05");
  });
  it("経過時間に応じて色の段階を変える", () => {
    expect(elapsedTone(placed, at(299))).toBe("normal");
    expect(elapsedTone(placed, at(300))).toBe("waiting");
    expect(elapsedTone(placed, at(600))).toBe("late");
    expect(elapsedTone(placed, at(900))).toBe("critical");
  });
});
