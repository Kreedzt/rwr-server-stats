declare interface ServerItem {
  ip: string;
  port: number;
  group: string;
  name: string;
  website: string;
}

declare const ENV: {
  SERVER_MATCH_REGEX: string;
  MESSAGE_LIST: string;
  HTML_TITLE: string;
  SERVER_MATCH_REALM?: string;
};
