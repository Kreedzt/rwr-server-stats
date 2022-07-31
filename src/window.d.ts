declare interface ServerItem {
    ip: string;
    port: number;
    group: string;
    name: string;
    website: string;
}

declare const server_list:  ServerItem[];
declare const message_list: string[];