# RWR 服务器状态查询

![license](https://badgen.net/github/license/Kreedzt/rwr-server-stats)
[![codecov](https://codecov.io/gh/Kreedzt/rwr-server-stats/branch/master/graph/badge.svg?token=OLK64A6MAM)](https://codecov.io/gh/Kreedzt/rwr-server-stats)
![latest release](https://badgen.net/github/release/Kreedzt/rwr-server-stats)
![commits count](https://badgen.net/github/commits/Kreedzt/rwr-server-stats)
![last commit](https://badgen.net/github/last-commit/Kreedzt/rwr-server-stats)

## 配置环境变量

- SERVER_MATCH_REGEX: 正则表达式(JavaScript), 用于过滤服务器列表, 只有匹配的服务器才会被渲染
- MESSAGE_LIST: 该常量为提供顶部的消息提示, 类型为字符串数组, 按照 `\n` 符号换行
- HTML_TITLE: 网站标题, 会显示在浏览器标签页上
- SERVER_MATCH_REALM: 仅限查询官方服务器使用, 对应 realm 值
  + official_invasion: 官方入侵服务器
  + official_pacific: 官方二战服务器
  + official_dominance: 官方 PVP 服务器
- ROUTE_PREFIX: 路由前缀, 配合 Docker/k8s 部署使用 

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKreedzt%2Frwr-server-stats&env=MESSAGE_LIST,SERVER_MATCH_REGEX,HTML_TITLE,SERVER_MATCH_REALM&envDescription=SERVER_MATCH_REGEX%3A%20%E4%B8%BA%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F(JavaScript)%2C%20%E5%8F%AA%E6%9C%89%E5%8C%B9%E9%85%8D%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%89%8D%E4%BC%9A%E8%A2%AB%E6%B8%B2%E6%9F%93&envLink=https%3A%2F%2Fgithub.com%2FKreedzt%2Frwr-server-stats%2Fblob%2Fmaster%2FREADME.md%23%25E9%2585%258D%25E7%25BD%25AE%25E7%258E%25AF%25E5%25A2%2583%25E5%258F%2598%25E9%2587%258F&project-name=rwr-server-stats&repository-name=rwr-server-stats)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Kreedzt/rwr-server-stats)

见 [部署文档](https://github.com/Kreedzt/rwr-server-stats/blob/master/DEPLOYMENT.md)

## 同类型项目

- [rwr-serv-stats](https://github.com/frg2089/rwr-serv-stats)

## 协议

- [GPLv3](https://opensource.org/licenses/GPL-3.0)
