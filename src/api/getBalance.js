import resource from 'resource-router-middleware';

const wallets = [];

// rinkerby ethereum faucet
//account refer keyrock-testing-accounts
// walletAddress[2] = {
// 'publickey':'0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e',
// 'privatekey':''
// };

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'getBalance',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load({ params, gasPrices, web3 }, id, callback) {
		let wallet = wallets.find( wallet => wallet.id===id ),
			err = wallet ? null : 'Not found';
		callback(null, wallet);

	},

	/** GET / - List all entities */
	index({ params, gasPrices, web3 }, res) {
		//console.log(gasPrices);
		//console.log(web3);
		console.log('index call----');
		console.log('req',params);
		res.json(wallets);
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		body.id = wallets.length.toString(36);
		wallets.push(body);
		res.json(body);
	},

	/** GET /:id - Return a given entity */
	read({ params, gasPrices, web3 }, res) {
		console.log('read call----');
		console.log('req',params);

		web3.eth.getBalance(params.getBalance, function (error, result) {
			if (error) {
				console.log('error',error)

				res.json({
		      		'response':'getBalance' ,
		      		'error':JSON.stringify(error)
		      	});
			} else {
				console.log('result',result.toString());
				let balance = web3.fromWei(result.toString(), 'ether');
				console.log('balance',balance);

				res.json({
		      		'response':'getBalance' ,
		      		'balance':balance
		      	});
			}
	    });
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
