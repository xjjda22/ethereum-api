import resource from 'resource-router-middleware';
import Wallet from 'ethereumjs-wallet/hdkey';
import bip39 from 'bip39';

const wallets = [];

//example of ethereum bip39 hd wallet
// {
//     "response": "createWallet",
//     "path": "m/44'/60'/0'/0",
//     "index": "0",
//     "mnemonic": "cook balance apple fork swallow early program refuse vicious month patient viable",
//     "address": "0x85ae881433ba05d86b919a0dca7a63f0fe454259",
//     "privatekey": ""
// }

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'createWallet',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let wallet = wallets.find( wallet => wallet.id===id ),
			err = wallet ? null : 'Not found';
		callback(null, wallet);
	},

	/** GET / - List all entities */
	index({ params, gasPrices, web3 }, res) {
		//console.log(gasPrices);
		//console.log(web3);

		var wallet,cwallet,new_privatekey,new_address;
		var mnemonic,seed;
		var xpriv,xpub;
		var path,index;

		path = "m/44'/60'/0'/0";//ethereum 
		//path = "m/"+req.params.path+"/"+req.params.coin+"'/0'/0";
		index = 0;
		//index = req.params.index,

		mnemonic = bip39.generateMnemonic(); //generates string
		//mnemonic = 'cook balance apple fork swallow early program refuse vicious month patient viable';
	 	seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer

	 	console.log('mnemonic',mnemonic);
		console.log('seed',seed);
	 	
	 	wallet = Wallet.fromMasterSeed(seed);
	 	wallet = wallet.derivePath(path);
	 	xpriv = wallet.privateExtendedKey();
	 	xpub = wallet.publicExtendedKey();

	 	wallet = wallet.deriveChild(index);
	 	cwallet = wallet.getWallet();

	 	xpriv = wallet.privateExtendedKey();
	 	xpub = wallet.publicExtendedKey();

	 	new_privatekey = cwallet.getPrivateKey().toString('hex');
		new_address = '0x'+cwallet.getAddress().toString('hex');

		console.log('wallet',wallet);
		console.log('cwallet',cwallet);
		console.log('new_privatekey',new_privatekey);
		console.log('new_address',new_address);

		res.json({
			'response':'createWallet',
			'path':path,
			'index':index,
			'mnemonic':mnemonic,
			//'seed':seed.toString('hex'),
			//'xpriv':xpriv,
			//'xpub':xpub,
			'address':new_address,
			'privatekey':new_privatekey
		});

		//res.json(wallets);
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
