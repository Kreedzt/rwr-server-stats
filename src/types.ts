export interface GroupedServerItem {
  groupName: string;
  serverList: ServerItem[];
}

export type Nullable<T> = T | null | undefined;

export interface DisplayServerItem {
  name: string;
  ipAddress: string;
  port: string;
  mapId: string;
  mapName: Nullable<string>;
  bots: number;
  country: string;
  currentPlayers: number;
  timeStamp: Nullable<number>;
  version: string;
  dedicated: boolean;
  // TODO: unknown value
  mod: Nullable<any>;
  playerList: string[];
  comment: Nullable<string>;
  url: Nullable<string>;
  maxPlayers: number;
  mode: string;
  // TODO: unknown value
  realm: Nullable<any>;
}
