'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _resourceRouterMiddleware = require('resource-router-middleware');

var _resourceRouterMiddleware2 = _interopRequireDefault(_resourceRouterMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wallets = [];

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;
	return (0, _resourceRouterMiddleware2.default)({

		/** Property name to store preloaded entity on `request`. */
		id: 'wallets',

		/** For requests with an `id`, you can auto-load the entity.
   *  Errors terminate the request, success sets `req[id] = data`.
   */
		load: function load(req, id, callback) {
			var wallet = wallets.find(function (wallet) {
				return wallet.id === id;
			}),
			    err = wallet ? null : 'Not found';
			callback(err, wallet);
		},


		/** GET / - List all entities */
		index: function index(_ref2, res) {
			var params = _ref2.params;

			//console.log(arguments)
			res.json(wallets);
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
//# sourceMappingURL=wallets.js.map