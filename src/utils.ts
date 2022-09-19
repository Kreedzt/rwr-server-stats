import { DisplayServerItem } from "./types";
import { getServerList } from "./services";

const parseElementText = (
  element: Element,
  selector: string
): string | null | undefined => {
  return element.querySelector(selector)?.textContent;
};

export const parseServerListFromString = (
  resString: string
): DisplayServerItem[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(resString, "text/xml");

  const serverXMLList = xmlDoc.querySelectorAll("result > server");

  const serverList: any[] = [];

  serverXMLList.forEach((element) => {
    const name = parseElementText(element, "name") as string;
    const ipAddress = parseElementText(element, "address") as string;
    const port = parseElementText(element, "port") as string;
    const mapId = parseElementText(element, "map_id") as string;
    const mapName = parseElementText(element, "map_name");
    const bots = parseInt(parseElementText(element, "bots") as string);
    const country = parseElementText(element, "country") as string;

    const currentPlayers = parseInt(
      parseElementText(element, "current_players") as string
    );

    const timeStampRaw = parseElementText(element, "timeStamp");
    const timeStamp = timeStampRaw ? parseInt(timeStampRaw) : undefined;

    const version = parseElementText(element, "version") as string;
    const dedicated =
      parseElementText(element, "dedicated") === "1" ? true : false;
    const mod = parseElementText(element, "mod");
    const playerList = Array.from(element.querySelectorAll("player")).map(
      (el) => el.textContent as string
    );

    const comment = parseElementText(element, "comment");
    const url = parseElementText(element, "url");
    const maxPlayers = parseInt(
      parseElementText(element, "max_players") as string
    );
    const mode = parseElementText(element, "mode") as string;
    const realm = parseElementText(element, "realm");

    const block: DisplayServerItem = {
      name,
      ipAddress,
      port,
      mapId,
      mapName,
      bots,
      country,
      currentPlayers,
      timeStamp,
      version,
      dedicated,
      mod,
      playerList,
      comment,
      url,
      maxPlayers,
      mode,
      realm,
    };

    serverList.push(block);
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
