export interface ServerItem {
    banner_image: string;
    group: string;
    name: string;
    website: string;
}

export interface GroupedServerItem {
    groupName: string;
    serverList: ServerItem[];
}