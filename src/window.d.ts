declare interface ServerItem {
  ip: string;
  port: number;
  group: string;
  name: string;
  website: string;
}

declare interface ENV {
  SERVER_MATCH_REGEX: string;
  MESSAGE_LIST: string;
  HTML_TITLE: string;
  SERVER_MATCH_REALM?: string;
  ROUTE_PREFIX?: string;
};

interface Window {
  ENV: ENV;
}
