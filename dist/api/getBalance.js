'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _resourceRouterMiddleware = require('resource-router-middleware');

var _resourceRouterMiddleware2 = _interopRequireDefault(_resourceRouterMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wallets = [];

// rinkerby ethereum faucet
//account refer keyrock-testing-accounts
// walletAddress[2] = {
// 'publickey':'0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e',
// 'privatekey':''
// };

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;
	return (0, _resourceRouterMiddleware2.default)({

		/** Property name to store preloaded entity on `request`. */
		id: 'getBalance',

		/** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
		load: function load(_ref2, id, callback) {
			var params = _ref2.params,
			    gasPrices = _ref2.gasPrices,
			    web3 = _ref2.web3;

			var wallet = wallets.find(function (wallet) {
				return wallet.id === id;
			}),
			    err = wallet ? null : 'Not found';
			callback(null, wallet);
		},


		/** GET / - List all entities */
		index: function index(_ref3, res) {
			var params = _ref3.params,
			    gasPrices = _ref3.gasPrices,
			    web3 = _ref3.web3;

			//console.log(gasPrices);
			//console.log(web3);
			console.log('index call----');
			console.log('req', params);
			res.json(wallets);
		},


		/** POST / - Create a new entity */
		create: function create(_ref4, res) {
			var body = _ref4.body;

			body.id = wallets.length.toString(36);
			wallets.push(body);
			res.json(body);
		},


		/** GET /:id - Return a given entity */
		read: function read(_ref5, res) {
			var params = _ref5.params,
			    gasPrices = _ref5.gasPrices,
			    web3 = _ref5.web3;

			console.log('read call----');
			console.log('req', params);

			web3.eth.getBalance(params.getBalance, function (error, result) {
				if (error) {
					console.log('error', error);

					res.json({
						'response': 'getBalance',
						'error': JSON.stringify(error)
					});
				} else {
					console.log('result', result.toString());
					var balance = web3.fromWei(result.toString(), 'ether');
					console.log('balance', balance);

					res.json({
						'response': 'getBalance',
						'balance': balance
					});
				}
			});
		},


		/** PUT /:id - Update a given entity */
		update: function update(_ref6, res) {
			var wallet = _ref6.wallet,
			    body = _ref6.body;

			//console.log(arguments);
			for (var key in body) {
				if (key !== 'id') {
					wallet[key] = body[key];
				}
			}
			res.sendStatus(204);
		},


		/** DELETE /:id - Delete a given entity */
		delete: function _delete(_ref7, res) {
			var wallet = _ref7.wallet;

			wallets.splice(wallets.indexOf(wallet), 1);
			res.sendStatus(204);
		}
	});
};
//# sourceMappingURL=getBalance.js.map