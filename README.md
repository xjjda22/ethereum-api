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
1 cd express-es6-rest-api
2- rm -rf .git && git init && npm init
3- npm install
4- PORT=8080 npm run dev

use postman to test these api
create bip39 wallet for ethereum 
http://localhost:8080/createWallet/44'/60/0

case: create ether wallet on rinkeby network
method: post
endpoint: http://localhost:8080/createWallet
body: {
}
response:{
	"mnemonic":"",
	"address":"",
	"privatekey":""
}

case: get balance from rinkeby network
method: get
endpoint: http://localhost:8080/getBalance/0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e
body: {
}
response:{
	"balance":""
}

case: transfer etherum on rinkeby network
method: post
endpoint: http://localhost:8080/transaction
body: {
	"privatekey":"0x00***pk***", 
	"destination":"0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e", 
	"amount":"0.02",
	"send":true//true or false
}
response:{
	"gasPrices":"",
	"transactionId":"",
	"transactionUrl":""
}
```

License
MIT