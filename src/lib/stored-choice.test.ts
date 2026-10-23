import { beforeEach, describe, expect, it } from "vitest";

import { loadStoredChoice, saveStoredChoice } from "./stored-choice";

const isTable = (value: string) => ["1", "2", "3"].includes(value);

describe("前回の選択の保存", () => {
  beforeEach(() => localStorage.clear());

  it("保存した値を読み戻す", () => {
    saveStoredChoice("table", "2");
    expect(loadStoredChoice("table", isTable)).toBe("2");
  });
  it("無効な値は空として扱う", () => {
    localStorage.setItem("table", "99");
    expect(loadStoredChoice("table", isTable)).toBe("");
  });
  it("未保存なら空を返す", () => {
    expect(loadStoredChoice("table", isTable)).toBe("");
  });
});
