'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _resourceRouterMiddleware = require('resource-router-middleware');

var _resourceRouterMiddleware2 = _interopRequireDefault(_resourceRouterMiddleware);

var _hdkey = require('ethereumjs-wallet/hdkey');

var _hdkey2 = _interopRequireDefault(_hdkey);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wallets = [];

//example of ethereum bip39 hd wallet
// {
//     "response": "createWallet",
//     "path": "m/44'/60'/0'/0",
//     "index": "0",
//     "mnemonic": "cook balance apple fork swallow early program refuse vicious month patient viable",
//     "address": "0x85ae881433ba05d86b919a0dca7a63f0fe454259",
//     "privatekey": ""
// }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;
	return (0, _resourceRouterMiddleware2.default)({

		/** Property name to store preloaded entity on `request`. */
		id: 'createWallet',

		/** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
		load: function load(req, id, callback) {
			var wallet = wallets.find(function (wallet) {
				return wallet.id === id;
			}),
			    err = wallet ? null : 'Not found';
			callback(null, wallet);
		},


		/** GET / - List all entities */
		index: function index(_ref2, res) {
			var params = _ref2.params,
			    gasPrices = _ref2.gasPrices,
			    web3 = _ref2.web3;

			//console.log(gasPrices);
			//console.log(web3);

			var wallet, cwallet, new_privatekey, new_address;
			var mnemonic, seed;
			var xpriv, xpub;
			var path, index;

			path = "m/44'/60'/0'/0"; //ethereum 
			//path = "m/"+req.params.path+"/"+req.params.coin+"'/0'/0";
			index = 0;
			//index = req.params.index,

			mnemonic = _bip2.default.generateMnemonic(); //generates string
			//mnemonic = 'cook balance apple fork swallow early program refuse vicious month patient viable';
			seed = _bip2.default.mnemonicToSeed(mnemonic); //creates seed buffer

			console.log('mnemonic', mnemonic);
			console.log('seed', seed);

			wallet = _hdkey2.default.fromMasterSeed(seed);
			wallet = wallet.derivePath(path);
			xpriv = wallet.privateExtendedKey();
			xpub = wallet.publicExtendedKey();

			wallet = wallet.deriveChild(index);
			cwallet = wallet.getWallet();

			xpriv = wallet.privateExtendedKey();
			xpub = wallet.publicExtendedKey();

			new_privatekey = cwallet.getPrivateKey().toString('hex');
			new_address = '0x' + cwallet.getAddress().toString('hex');

			console.log('wallet', wallet);
			console.log('cwallet', cwallet);
			console.log('new_privatekey', new_privatekey);
			console.log('new_address', new_address);

			res.json({
				'response': 'createWallet',
				'path': path,
				'index': index,
				'mnemonic': mnemonic,
				//'seed':seed.toString('hex'),
				//'xpriv':xpriv,
				//'xpub':xpub,
				'address': new_address,
				'privatekey': new_privatekey
			});

			//res.json(wallets);
		},


		/** POST / - Create a new entity */
		create: function create(_ref3, res) {
			var body = _ref3.body;

			body.id = wallets.length.toString(36);
			wallets.push(body);
			res.json(body);
		},


		/** GET /:id - Return a given entity */
		read: function read(_ref4, res) {
			var wallet = _ref4.wallet;

			res.json(wallet);
		},


		/** PUT /:id - Update a given entity */
		update: function update(_ref5, res) {
			var wallet = _ref5.wallet,
			    body = _ref5.body;

			//console.log(arguments);
			for (var key in body) {
				if (key !== 'id') {
					wallet[key] = body[key];
				}
			}
			res.sendStatus(204);
		},


		/** DELETE /:id - Delete a given entity */
		delete: function _delete(_ref6, res) {
			var wallet = _ref6.wallet;

			wallets.splice(wallets.indexOf(wallet), 1);
			res.sendStatus(204);
		}
	});
};
//# sourceMappingURL=createWallet.js.map