import { describe, expect, it } from "vitest";
import { getCurrentTimeStr } from "./utils";

describe("getCurrentTimeStr test", () => {
  it.concurrent("should return correct string", () => {
    const res = getCurrentTimeStr();

    const matchRegex = /\d+-\d+-\s\d+:\d+:\d+/;

    expect(matchRegex.test(res));
  });
});
