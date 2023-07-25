import { describe, expect, it } from "vitest";
import { generateEmptyOnlineStatItem, getCurrentTimeStr } from "./utils";

describe("getCurrentTimeStr test", () => {
  it.concurrent("should return correct string", () => {
    const res = getCurrentTimeStr();

    const matchRegex = /\d+-\d+-\s\d+:\d+:\d+/;

    expect(matchRegex.test(res));
  });
});

describe("generateEmptyOnlineStatItem", () => {
  it.concurrent("should return correct object", () => {
    const res = generateEmptyOnlineStatItem();

    expect(res).toEqual({
      onlineServerCount: 0,
      allServerCount: 0,
      onlinePlayerCount: 0,
      playerCapacityCount: 0,
    });
  });
});
