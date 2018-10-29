# 게임 서버
**BORA Ecosystem testnet**을 위한 Node.js 게임 서버입니다.

## Background
- Game([masonicGit/Pacman](https://github.com/masonicGIT/pacman)): GitHub에 이미 존재하는 게임을 사용하였습니다. 게임 소스는 이 git에 포함되어 있습니다.
- Node.js([Node.js Official Site](https://nodejs.org)): 서버를 구동하기 위하여 Node.js를 사용합니다.
- npm([npm Official Site](https://www.npmjs.com/)): 서버 구동에 필요한 패키지 설치를 위하여 npm을 사용합니다.
- Redis([Redis Official Site](https://redis.io/)): 게임서버에서는 랭킹 정보를 위해서 Redis를 사용합니다. 


## 설치
### 필요 프로그램
게임 서버의 구동을 위해서는 아래 프로그램이 필요합니다.
- Node.js
- npm
### 선택 프로그램
- pm2([PM2 Official Site](http://pm2.keymetrics.io/)): PM2를 이용하여, Node.js서버를 관리할 수 있습니다.
### 필요 서비스
- Redis: 접속 가능한 Redis서버가 없는 경우, 별도 Redis 서버 설치가 필요합니다.
### 다운로드
이 git 저장소를 clone 하시기 바랍니다.
```bash
git clone https://github.com/boraecosystem/game-pacman.git
cd game-pacman
npm install
```


## 설정
config/config.json 파일 내용을 확인하시고 본인 환경에 맞게 설정하세요. 
```
"serv_port": 3200,                                        // 서버 포트
"redis_host": "127.0.0.1",                                // Redis 주소
"redis_port": 6379,                                       // Redis 포트
"auth_redirect_uri": "http://localhost:4200/cb",          // OAuth2.0 redirect Uri(수정 금지)
"game_uri": "/public/html/index.htm",                     // 게임 랜딩 페이지(수정 금지)
"chain_api_uri": "testnet.bora-lagoon.com" // Chain-API 주소(수정 금지)
```


## 사용
localhost에 게임 서버를 구동합니다. 또는 설정에서 직접 수정한 내용에 맞춰 실행 변수를 전달하셔도 됩니다.
```bash
node app.js
```
또는 PM2가 설치된 경우, 아래와 같이 구동할 수 있습니다.(pm2를 통한 구동을 원하시는 경우, pm2 패키지를 설치하셔야 합니다.)
```bash
pm2 start app.js
```


## **BORA Ecosystem testnet** 연동
연동 예제 코드는 아래를 참고해 주시기 바랍니다.

### 서버 인증 - Client Credentials Grant
``` javascript
function getClientToken(cb) {
    const data = 'grant_type=client_credentials';
    const req = httpOAuth.request({
        protocol: 'https:',
        host: chain_api_uri,
        port: 443,
        method: 'post',
        path: '/member/oauth/token',
        auth: `${clientId}:${clientSecret}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => cb(JSON.parse(body)));
    }
    );
    req.on('error', e => console.error(`problem with request: ${e.message}`));
    req.write(data);
    req.end();
}
```

### 클라이언트 인증 - Authorization Code Grant
게임 서버가 OAuth2.0 인증을 위한 웹서버 역할도 겸합니다.
```javascript
function getUserToken(data, cb) {
    const req = httpOAuth.request({
        protocol: 'https:',
        host: chain_api_uri,
        port: 443,
        method: 'post',
        path: '/member/oauth/token',
        auth: `${clientId}:${clientSecret}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => cb(JSON.parse(body)));
        console.log(body);
    }
    );
    req.on('error', e => console.error(`problem with request: ${e.message}`));
    req.write(data);
    req.end();
}
```

### BORA Shell 전송
```javascript
chainApi.saveScore(apiuri, clientAccessToken, toAddr, amount, function (error, data) {
    if (!error) {
        res.send(data);
    } else {
        res.send(data);
    }
});

saveScore: function (host, clientAccessToken, toAddr, amount, callback) {
    OPTIONS.url = 'https://' + host +':443/bill-api/v1/services/deposit/' + toAddr + '/' + amount;
    OPTIONS.body = '';
    OPTIONS.headers = {Authorization: 'Bearer '+ clientAccessToken};
    request.get(OPTIONS, function (err, res, result) {
        statusCodeErrorHandler(res.statusCode, callback, result);
    });
}
```


## Thanks to
  게임 masonicGit/Pacman
