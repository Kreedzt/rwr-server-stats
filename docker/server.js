const http = require('http');
const fs = require('fs');
const path = require('path');

const OVERWRITE_ENV = {
  SERVER_MATCH_REGEX: process.env.SERVER_MATCH_REGEX,
  MESSAGE_LIST: process.env.MESSAGE_LIST,
  HTML_TITLE: process.env.HTML_TITLE,
  SERVER_MATCH_REALM: process.env.SERVER_MATCH_REALM
};

console.log('overwrite env:', JSON.stringify(OVERWRITE_ENV));

const logAccess = (req, res, start) => {
  console.log(JSON.stringify({
    type: 'access',
    level: res.statusCode >= 200 && res.statusCode < 400 ? 'info': 'error',
    time: new Date().toISOString(),
    message: {
      http: {
        elapse: new Date().getTime() - start,
        status: res.statusCode,
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        referer: req.headers.referer
      }
    }
  }));
}

let htmlContent = fs.readFileSync('dist/index.html', 'utf-8');
const replaceEnv = () => {
  let newHTML = htmlContent;
  Object.entries(OVERWRITE_ENV).forEach(([k, v]) => {
    if (v) {
      newHTML = newHTML.replace(`<${k}>`, v);
    }
  });

  if (!OVERWRITE_ENV.SERVER_MATCH_REALM) {
    newHTML = newHTML.replace('<SERVER_MATCH_REALM>', '');
  }

  if (newHTML !== htmlContent) {
    htmlContent = newHTML;
  }
};

replaceEnv();

const getApi = (url) => {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

const server = http.createServer((req, res) => {
  const start = Date.now();

  if (req.url === '/ping') {
    res.write('pong');
    res.end();
  } else if (req.method === 'GET') {
    // api
    if (req.url.startsWith('/api')) {
      const remoteUrl = req.url.replace('/api', 'http://rwr.runningwithrifles.com/');
      console.log('remoteUrl', remoteUrl);
      getApi(remoteUrl).then((remoteRes) => {
        console.log('remoteRes', remoteRes);
        res.writeHead(200, {
          'Content-Type': 'text/xml'
        });
        res.end(remoteRes.toString());
        logAccess(req, res, start);
      }).catch(err => {
        console.log('Remote api call err', err);
        console.dir(err);

        res.writeHead(404);
        res.end('Remote api response error');
        logAccess(req, res, start);
      });
      return;
    }

    // file
    const reqFilePath = `.${req.url === '/' ? '/index.html' : req.url}`;
    const fsPath = path.join(__dirname, './dist', req.url);

    const ext = path.extname(reqFilePath);
    let contentType = 'text/html';

    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
    }

    if (req.url === '/') {
      res.writeHead(200, {
        'Content-Type': contentType
      });
      res.end(htmlContent, 'utf-8');

      logAccess(req, res, start);
    } else {
      fs.readFile(fsPath, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // 文件不存在
            res.writeHead(404);
            res.end('File not found');
          } else {
            // 服务器错误
            res.writeHead(500);
            res.end('Sorry, there was an error: ', err.code);
          }
        } else {
          // 成功读取文件
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }

        logAccess(req, res, start);
      });
    }

  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(80, () => {
  console.log('Http server started.');
});

const exitHandler = (e) => {
  console.log('exitHandler', e);

  server.close(() => {
    console.log('Server closed');
    process.exit(1);
  })
};

// 监听 exit 事件
process.on('exit', (e) => {
  console.log('on:exit', e);
  exitHandler({ cleanup: true });
});

// 监听 SIGINT 信号 (Ctrl+C)
process.on('SIGINT', (e) => {
  console.log('on:SIGINT', e);
  exitHandler({ exit: true });
});

// 监听 SIGTERM 信号 (kill)
process.on('SIGTERM', (e) => {
  console.log('on:SIGTERM', e);
  exitHandler({ exit: true });
});

// 监听未捕获的异常
process.on('uncaughtException', (e) => {
  console.log('on:uncaughtException', e);
  exitHandler({ exit: true });
});
