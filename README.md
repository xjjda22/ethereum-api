Express & ES6 REST API Boilerplate
==================================

This is a straightforward boilerplate for building REST APIs with ES6 and Express.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).



Getting Started
---------------

```sh
# clone it
git clone git@github.com:developit/express-es6-rest-api.git
cd express-es6-rest-api

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start
```
Docker Support
------
```sh
cd express-es6-rest-api

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```
ethereum api
------
```sh
1- cd express-es6-rest-api
2- rm -rf .git && git init && npm init
3- npm install
4- PORT=8080 npm run dev

use postman to test these api
create bip39 wallet for ethereum 
request--
http://localhost:8080/createWallet/44'/60/0
parameters---
path/coin/index
response --
{
    "response": "createWallet",
    "path": "m/44'/60'/0'/0",
    "index": "0",
    "mnemonic": "",
    "address": "",
    "privatekey": ""
}

get balance from rinkeby network
request--
http://localhost:8080/getBalance/0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e
parameters---
address
response--
{
    "response": "getBalance",
    "balance": "0.22"
}

transfer etherum on rinkeby network
request---
http://localhost:8080/transaction
parameters---
address
{
	"privatekey":"", 
	"destination":"", 
	"amount":"0.02",
	"send":true//true or false
}
response--
{
    "response": "transaction",
    "gasPrices": {
        "low": 6,
        "medium": 7,
        "high": 15
    },
    "transactionId": "0x7fa0491e08616c864bc8b1caf12b0547968fb68cbfe6855f4375e6c8bff310c0",
    "transactionUrl": "https://rinkeby.etherscan.io/tx/0x7fa0491e08616c864bc8b1caf12b0547968fb68cbfe6855f4375e6c8bff310c0",
    "getSenderAddress": "0x2d0e6fbef8e7322e59fb666be326a3ad88704718"
}
```
License
-------

MIT
