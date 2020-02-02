'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _package = require('../../package.json');

var _express = require('express');

var _facets = require('./facets');

var _facets2 = _interopRequireDefault(_facets);

var _wallets = require('./wallets');

var _wallets2 = _interopRequireDefault(_wallets);

var _createWallet = require('./createWallet');

var _createWallet2 = _interopRequireDefault(_createWallet);

var _getBalance = require('./getBalance');

var _getBalance2 = _interopRequireDefault(_getBalance);

var _transaction = require('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// mount the facets resource
	//api.use('/facets', facets({ config, db }));

	// mount the wallets resource
	//api.use('/wallets', wallets({ config, db }));

	//create wallet
	api.use('/createWallet', (0, _createWallet2.default)({ config: config, db: db }));

	//getBalance
	api.use('/getBalance', (0, _getBalance2.default)({ config: config, db: db }));

	//transaction
	api.use('/transaction', (0, _transaction2.default)({ config: config, db: db }));

	// perhaps expose some API metadata at the root
	api.get('/', function (req, res) {
		res.json({ version: _package.version });
	});

	return api;
};
//# sourceMappingURL=index.js.map