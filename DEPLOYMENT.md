# RWR 服务器状态查询项目部署流程

该项目仅为前端, 不依赖任意项目, 请求依赖外部地址: [rwr stats](https://rwrstats.com/servers/)

## 部署方式

以下部署方式二选一即可

- 手动部署
- Docker 部署(若选择 Docker 部署, 服务端也需要选择 Docker 部署)

### 手动部署

#### 准备工作
> 手动部署需要一个 web 服务器来挂载, 如: NGINX
> 以下操作以 NGINX 为例

编写 nginx.conf 文件, 内容如下所示:

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

复制一份本项目根目录的 `mime.types` 文件, 放置到与 `nginx.conf` 文件同位置

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

需要挂载的目录:
- /dist/env

启动示例:
```sh
docker run --name rwr-server-stats-docker -p 10010:80 -d zhaozisong0/rwr-server-stats:latest
```
