# Game Server
Node.js game server for **BORA Lagoon Testnet**.

## Background
- Game([masonicGit/Pacman](https://github.com/masonicGIT/pacman)): Used a game that already exists in the GitHub. Game sources are included in this repository.
- Node.js([Node.js Official Site](https://nodejs.org)): Node.js is used to run the server.
- npm([npm Official Site](https://www.npmjs.com/)): npm is used to install packages needed to run server.
- Redis([Redis Official Site](https://redis.io/)): The game server uses Redis for ranking information.


## Install
### Required applications
The following applications are required to run game server.
- Node.js
- npm
- Redis: If you do not have an available Redis server, you will need to install a separate Redis server.
### Optional application
- pm2([PM2 Official Site](http://pm2.keymetrics.io/)): PM2 can be used to manage the Node.js server.
### Download
Clone this repository.
```bash
git clone https://github.com/boraecosystem/game-pacman.git
cd game-pacman
npm install
```


## Configuration
Please check the contents of the config/config.json file and set it according to your environment.
```
"serv_port": 3200,                                        // server port
"redis_host": "127.0.0.1",                                // Redis host
"redis_port": 6379,                                       // Redis port
"auth_redirect_uri": "http://localhost:4200/cb",          // OAuth2.0 redirect uri(Do not modify)
"game_uri": "/public/html/index.htm",                     // game page(Do not modify)
"chain_api_uri": "testnet.bora-lagoon.com" // Chain-API uri(Do not modify)
```


## Usage
To run the game server on localhost, pass the 'local' parameter when running the game server. Or you can pass the run parameter according to what you have modified directly in the configuration.
```bash
node app.js
```
Alternatively, if the PM2 is installed, you can run as follows. (If you want to run through the PM2, you have to install the PM2 package.)
```bash
pm2 start app.js
```


## Integration with **BORA Lagoon Testnet**
Please see the integration example code below.

### Authorization in the game server - Client Credentials Grant
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

### Client Autorization - Authorization Code Grant
The game server also acts as a web server for OAuth2.0 authorization.
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

### Transfer BORA Shell
```javascript
chainApi.saveScore(apiuri, clientAccessToken, toAddr, amount, function (error, data) {
    if (!error) {
        res.send(data);
    } else {
        res.send(data);
    }
});

saveScore: function (host, clientAccessToken, toAddr, amount, callback) {
    OPTIONS.url = 'https://' + host +':443/chain/v1/services/deposit/' + toAddr + '/' + amount;
    OPTIONS.body = '';
    OPTIONS.headers = {Authorization: 'Bearer '+ clientAccessToken};
    request.get(OPTIONS, function (err, res, result) {
        statusCodeErrorHandler(res.statusCode, callback, result);
    });
}
```


## About game
The game used in the example uses the code of https://github.com/masonicGIT/pacman. Please check the github repository for a description of this game. We would like to thank the developers who have provided the examples.
