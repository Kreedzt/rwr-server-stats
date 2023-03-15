window.title = "RWR 信息状态查询";

const message_list = [
  "> 若所有信息无法获取, 可能是 http://rwr.runningwithrifles.com/rwr_server_list  服务器出现问题",
  "> 若单独几个信息无法获取，则服务器可能在换图",
  "> 若长期所有信息无法获取，请联系服务器管理员",
];

const server_list = [
  {
    ip: "124.223.113.204",
    port: 50170,
    group: "Azur Lane(碧蓝航线)",
    name: "Imba > Azur Lane #1",
    website:
      "https://rwrstats.com/servers/124.223.113.204:50170/azur-lane-imba-cn1",
  },
  {
    ip: "42.192.148.161",
    port: 50170,
    group: "Azur Lane(碧蓝航线)",
    name: "Imba > Azur Lane #2",
    website:
      "https://rwrstats.com/servers/42.192.148.161:50170/azur-lane-imba-cn2",
  },
  {
    ip: "42.192.148.161",
    port: 50167,
    group: "GFLNP(少女前线)",
    name: "Imba > GFLNP #1",
    website: "https://rwrstats.com/servers/42.192.148.161:50167/gflnp-imba-cn1",
  },
  {
    ip: "124.222.46.179",
    port: 50167,
    group: "GFLNP(少女前线)",
    name: "Imba > GFLNP #3",
    website: "https://rwrstats.com/servers/124.222.46.179:50167/gflnp-imba-cn3",
  },
  {
    ip: "124.223.113.204",
    port: 50167,
    group: "GFLNP(少女前线)",
    name: "Imba > GFLNP #5",
    website:
      "https://rwrstats.com/servers/124.223.113.204:50167/gflnp-imba-cn5",
  },
  {
    ip: "124.223.71.223",
    port: 50167,
    group: "GFLNP(少女前线)",
    name: "Imba > GFLNP #7",
    website: "https://rwrstats.com/servers/124.223.71.223:50167/gflnp-imba-cn7",
  },
  {
    ip: "124.223.71.223",
    port: 50067,
    group: "GFLNP(少女前线)",
    name: "Imba > GFLNP #11",
    website: "https://rwrstats.com/servers/124.223.71.223:50067/gflnp-imba-cn7",
  },
  {
    ip: "124.222.46.179",
    port: 50168,
    group: "RITBW(星河舰队)",
    name: "Imba > RITBW #Test",
    website:
      "https://rwrstats.com/servers/124.222.46.179:50168/ritbw-imba-test-cn1",
  },
  {
    ip: "124.223.113.204",
    port: 50168,
    group: "WW2 Undead(二战僵尸服务器)",
    name: "Imba > WW2 Undead #1",
    website:
      "https://rwrstats.com/servers/124.223.113.204:50168/ww2-undead-imba-test-cn1",
  },
  {
    ip: "124.223.71.223",
    port: 50180,
    group: "Increased Armory(军械库全解锁服务器)",
    name: "Imba > Increased Armory #Test",
    website:
      "https://rwrstats.com/servers/124.223.71.223:50180/increased-armory-imba-test-cn1",
  },
];
