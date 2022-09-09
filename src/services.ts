const SERVER_API_URL = "/api/rwr_server_list";

export const getServerList = async (params: {
  start: number;
  size: number;
  names: 1 | 0;
}) => {
  const queryParams = {
    start: params.start ?? 0,
    size: params.size ?? 20,
    names: params.names ?? 1,
  };

  const url = `${SERVER_API_URL}/get_server_list.php?start=${queryParams.start}&size=${queryParams.size}&names=${queryParams.names}`;

  return fetch(url).then((response) => response.text());
};
