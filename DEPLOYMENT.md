# RWR 服务器状态查询项目部署流程

该项目仅为前端, 不依赖任意项目, 请求依赖外部地址: [rwr stats](https://rwrstats.com/servers/)

## 部署方式

以下部署方式二选一即可

- 手动部署
- Docker 部署

### 手动部署

#### 准备工作

> 手动部署需要一个 web 服务器来挂载, 如: NGINX
> 以下操作以 NGINX 为例

1. 编写 nginx.conf 文件, 内容如下所示:

```nginx.conf
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            root /dist;
            try_files $uri $uri/ /index.html;
            index index.html;
        }
    }
}
```

2. 复制一份本项目根目录的 `mime.types` 文件, 放置到与 `nginx.conf` 文件同位置
3. 配置环境变量, 可在打包时通过编写 `.env` 文件使 vite 自动注入, 或者手动编写 script 标签注入到 window 中:
```html
<!--该 script 标签需要放置在 index.html 的 head 标签内-->
<script>
  window.SERVER_MATCH_REGEX='Imba >';
  window.MESSAGE_LIST = '这是第一行说明\n这是第二行说明';
  window.HTML_TITLE: 'RWR 服务器状态查询';
</script>
```

#### 启动 NGINX

进入 NGINX 目录, 使用如下命令读配置启动

```sh
# -c 后面跟上面编写的 nginx.conf 文件路径
nginx -c ../nginx.conf
```

#### 部署及更新

> 更新时无需重启 NGINX

将下载好的 [压缩包](https://github.com/Kreedzt/rwr-profile-stats/releases) 解压到上述步骤的路径中即可

启动完成后, 通过 80 端口即可访问

### Docker 部署

暴露端口为 80

需要配置的环境变量:

- SERVER_MATCH_REGEX
- MESSAGE_LIST
- HTML_TITLE
- SERVER_MATCH_REALM
- ROUTE_PREFIX

启动示例:

```sh
docker run --name rwr-server-stats-docker -p 10010:80 \
  -e MESSAGE_LIST='> 若单独几个信息无法获取，则服务器可能在换图\\n> 若长期所有信息无法获取，请联系服务器管理员\\n>"加入服务器"功能需要游戏客户端关闭时才生效' \
  -e SERVER_MATCH_REGEX='Invasion' \
  -e HTML_TITLE='Invasion: RWR 服务器状态查询' \
  -e SERVER_MATCH_REALM='official_invasion' \
  -e ROUTE_PREFIX='/imba' \
  -d zhaozisong0/rwr-server-stats:latest
```
