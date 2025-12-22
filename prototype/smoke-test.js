const http = require('http');
const { createServer, DEFAULT_PORT } = require('./dev-server');

function request(path, port) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: 'localhost', port, path }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data, headers: res.headers });
      });
    });
    req.on('error', reject);
  });
}

(async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const home = await request('/', port);
    if (home.status !== 200) {
      throw new Error(`홈 응답 실패: status ${home.status}`);
    }

    const theme = await request('/data/nordic-tech.json', port);
    if (theme.status !== 200) {
      throw new Error(`테마 JSON 응답 실패: status ${theme.status}`);
    }

    JSON.parse(theme.body);
    console.log(`프로토타입 프리뷰 스모크 통과 (포트 ${port}, 기본 포트 ${DEFAULT_PORT})`);
  } catch (error) {
    console.error('스모크 테스트 실패:', error.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
