import resource from 'resource-router-middleware';

const wallets = [];

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'wallets',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let wallet = wallets.find( wallet => wallet.id===id ),
			err = wallet ? null : 'Not found';
		callback(err, wallet);
	},

	/** GET / - List all entities */
	index({ params }, res) {
		//console.log(arguments)
		res.json(wallets);
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		body.id = wallets.length.toString(36);
		wallets.push(body);
		res.json(body);
	},

	/** GET /:id - Return a given entity */
	read({ wallet }, res) {
		res.json(wallet);
	},

	/** PUT /:id - Update a given entity */
	update({ wallet, body }, res) {
		//console.log(arguments);
		for (let key in body) {
			if (key!=='id') {
				wallet[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ wallet }, res) {
		wallets.splice(wallets.indexOf(wallet), 1);
		res.sendStatus(204);
	}
});
