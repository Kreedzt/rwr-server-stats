import { DisplayServerItem, OnlineStats, Res } from "./types";
import { getServerList } from "./services";
import { XMLParser } from "fast-xml-parser";

const parseElementText = (
  element: Element,
  selector: string
): string | null | undefined => {
  return element.querySelector(selector)?.textContent;
};

const fixPlayerList = (raw: string | undefined | string[]): string[] => {
  if (Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw === "string") {
    return [raw];
  }

  return [];
};

export const parseServerListFromString = (
  resString: string
): DisplayServerItem[] => {
  const parser = new XMLParser();
  const res = parser.parse(resString) as Res;

  const serverList: DisplayServerItem[] = res.result.server.map((server) => {
    const block: DisplayServerItem = {
      name: server.name,
      ipAddress: server.address,
      port: server.port,
      mapId: server.map_id,
      mapName: server.map_name,
      bots: server.bots,
      country: server.country,
      currentPlayers: server.current_players,
      timeStamp: server.timeStamp,
      version: server.version,
      dedicated: server.dedicated === 1,
      mod: server.mod,
      playerList: fixPlayerList(server.player),
      comment: server.comment,
      url: server.url,
      maxPlayers: server.max_players,
      mode: server.mode,
      realm: server.realm,
    };

    return block;
  });

  return serverList;
};

export const getUnlimitedServerList = async () => {
  let start = 0;
  const size = 100;

  const totalServerList: DisplayServerItem[] = [];

  let parsedServerList: DisplayServerItem[] = [];

  do {
    const newServerList = await getServerList({
      start,
      size,
      names: 1,
    });

    parsedServerList = parseServerListFromString(newServerList);

    totalServerList.push(...parsedServerList);
    start += size;
  } while (parsedServerList.length === size);

  return totalServerList;
};

export const getCurrentTimeStr = () => {
  const date = new Date();

  const yearStr = date.getFullYear();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, "0");
  const dateStr = date.getDate().toString().padStart(2, "0");
  const hourStr = date.getHours().toString().padStart(2, "0");
  const minuteStr = date.getMinutes().toString().padStart(2, "0");
  const secondStr = date.getSeconds().toString().padStart(2, "0");

  const fullStr =
    yearStr +
    "-" +
    monthStr +
    "-" +
    dateStr +
    " " +
    hourStr +
    ":" +
    minuteStr +
    ":" +
    secondStr;

  return fullStr;
};

export const generateEmptyOnlineStatItem = (): OnlineStats => {
  const temp: OnlineStats = {
    onlineServerCount: 0,
    allServerCount: 0,
    onlinePlayerCount: 0,
    playerCapacityCount: 0,
  };

  return temp;
};
