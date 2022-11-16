export interface GroupedServerItem {
  groupName: string;
  serverList: ServerItem[];
}

export type Nullable<T> = T | null | undefined;

export interface ResServerItem {
  name: string;
  address: string;
  port: number;
  map_id: string;
  map_name: string;
  bots: number;
  country: string;
  current_players: number;
  timeStamp: number;
  version: number;
  dedicated: number;
  mod: number,
  // [AAA, BBB] | AAA
  player?: string[] | string,
  comment: string;
  url: string;
  max_players: number;
  mode: string;
  realm: string;
}

export interface Res {
  result: {
    server: ResServerItem[];
  }
}

export interface DisplayServerItem {
  name: string;
  ipAddress: string;
  port: number;
  mapId: string;
  mapName: Nullable<string>;
  bots: number;
  country: string;
  currentPlayers: number;
  timeStamp: Nullable<number>;
  version: number;
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

export interface OnlineStats {
  allServerCount: number;
  onlineServerCount: number;
  onlinePlayerCount: number;
  playerCapacityCount: number;
}