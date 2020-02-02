'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

//--------- start ether api -----------
var connect_web3 = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		var web3, walletAddress, balance;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						web3 = void 0, walletAddress = [], balance = 0;
						_context.prev = 1;

						console.log('starting web3');
						_context.next = 5;
						return new _web2.default(new _web2.default.providers.HttpProvider("https://rinkeby.infura.io/P4692QP3VKFU6XTQDHV3H2WTWNBS137D2A"));

					case 5:
						web3 = _context.sent;

						//web3 = new Web3(new Web3.providers.HttpProvider("https://api.myetherapi.com/rin"));
						//web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));

						if (!web3.isConnected()) {
							console.log('Somethings wrong...');
						} else {
							app.use(function (req, res, next) {
								req.web3 = web3;
								next();
							});
						}
						_context.next = 12;
						break;

					case 9:
						_context.prev = 9;
						_context.t0 = _context['catch'](1);

						console.log('error', _context.t0);

					case 12:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this, [[1, 9]]);
	}));

	return function connect_web3() {
		return _ref.apply(this, arguments);
	};
}();

var getCurrentGasPrices = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
		var response, prices, gasPrices, db;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return _axios2.default.get('https://ethgasstation.info/json/ethgasAPI.json');

					case 2:
						response = _context2.sent;
						prices = {
							low: response.data.safeLow / 10,
							medium: response.data.average / 10,
							high: response.data.fast / 10
						};


						console.log('current gas prices', response.data);
						console.log('current gas prices', prices);

						gasPrices = prices;
						db = {};

						//app.set('gasPrices', gasPrices);

						app.use(function (req, res, next) {
							req.gasPrices = gasPrices;
							next();
						});

						// internal middleware
						app.use((0, _middleware2.default)({ config: _config2.default, db: db }));

						// api router
						app.use('/api', (0, _api2.default)({ config: _config2.default, db: db }));

						app.server.listen(process.env.PORT || _config2.default.port, function () {
							console.log('Started on port ' + app.server.address().port);
						});

					case 12:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getCurrentGasPrices() {
		return _ref2.apply(this, arguments);
	};
}();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _hdkey = require('ethereumjs-wallet/hdkey');

var _hdkey2 = _interopRequireDefault(_hdkey);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _hdkey3 = require('hdkey');

var _hdkey4 = _interopRequireDefault(_hdkey3);

var _ethjsUtil = require('ethjs-util');

var _ethjsUtil2 = _interopRequireDefault(_ethjsUtil);

var _ethereumjsTx = require('ethereumjs-tx');

var _ethereumjsTx2 = _interopRequireDefault(_ethereumjsTx);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//ethereum api 


var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// logger
app.use((0, _morgan2.default)('dev'));

// 3rd party middleware
app.use((0, _cors2.default)({
	exposedHeaders: _config2.default.corsHeaders
}));

app.use(_bodyParser2.default.json({
	limit: _config2.default.bodyLimit
}));
connect_web3();

getCurrentGasPrices();

exports.default = app;
//# sourceMappingURL=index.js.map