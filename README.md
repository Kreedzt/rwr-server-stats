# RWR 服务器状态查询

![license](https://badgen.net/github/license/Kreedzt/rwr-server-stats)
![latest release](https://badgen.net/github/release/Kreedzt/rwr-server-stats)
![commits count](https://badgen.net/github/commits/Kreedzt/rwr-server-stats)
![last commit](https://badgen.net/github/last-commit/Kreedzt/rwr-server-stats)

## 配置环境变量

所有需要配置的文件都在 `public/env` 目录下, 把文件名的 `_example` 去掉即可正常启动空项目

- server_list.js: 该文件提供服务器信息, 数组中每项结构如下:
  + ip: 服务器IP
  + port: 服务器端口
  + group: 分组名, 任意填写, 不同分组会以分割线隔开
  + name: 服务器名, 任意填写
  + website: 服务器详情信息地址, 从 [rwr stats](https://rwrstats.com/servers) 获取, 是渲染按钮的跳转链接地址
- message_list.js: 该文件名为提供顶部的消息提示, 类型为字符串数组, 会根据内容依次渲染 `p` 标签

## 开发

该项目依赖 [Nodejs](https://nodejs.org/en/) 进行开发

首先安装依赖包, 该项目采用 `pnpm` 进行包管理

安装 `pnpm` 命令:

```sh
npm i -g pnpm
```

安装依赖包:

```sh
pnpm i
```

启动开发环境

```sh
pnpm dev
```

启动后会在终端输出本地端口, 使用浏览器访问即可

## 构建

该项目依赖 [Nodejs](https://nodejs.org/en/) 进行打包操作

首先安装依赖包, 该项目采用 `pnpm` 进行包管理

安装 `pnpm` 命令:

```sh
npm i -g pnpm
```

安装依赖包:

```sh
pnpm i
```

构建

```sh
pnpm build
```

执行后会在 `dist` 目录下生成打包后代码

## 部署

见 [部署文档](https://github.com/Kreedzt/rwr-server-stats/blob/master/DEPLOYMENT.md)

## 同类型项目

- [rwr-serv-stats](https://github.com/frg2089/rwr-serv-stats)

## 协议

- [GPLv3](https://opensource.org/licenses/GPL-3.0)