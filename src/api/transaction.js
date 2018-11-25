import resource from 'resource-router-middleware';
import EthereumTx from 'ethereumjs-tx';

const wallets = [];

// rinkerby ethereum faucet
//account refer keyrock-testing-accounts
// walletAddress[0] = {
// 'publickey':'0x70DeFb7B30D575758ea0405ff26C3646CcCa0E10',
// 'privatekey':''
// };
// ether-2.01

// walletAddress[1] = {
// 'publickey':'0x2d0e6fbef8e7322e59fb666be326a3ad88704718',
// 'privatekey':''
// };
// ether-7.6

// walletAddress[2] = {
// 'publickey':'0x00ac8fbedd57107adbbb8a23d56cbf791bf0093e',
// 'privatekey':''
// };
// ether-0.22

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'transaction',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let wallet = wallets.find( wallet => wallet.id===id ),
			err = wallet ? null : 'Not found';
		callback(null, wallet);
	},

	/** GET / - List all entities */
	index({ params }, res) {
		console.log('index call---');
		res.json(wallets);
	},

	/** POST / - Create a new entity */
	create({ body, gasPrices, web3 }, res) {
		//body.id = wallets.length.toString(36);
		//wallets.push(body);
		console.log('create call---');
		console.log('body',body);

		var details,nonce;
		var privatekey, destination, amount, send;
		privatekey = body.privatekey;
		destination = body.destination;
		amount = body.amount;
		send = body.send;

		details = {
		    "to": destination,
		    "value": web3.toHex( web3.toWei(amount, 'ether') ),
		    "gas": 21000,
		    "gasPrice": gasPrices.low * 1000000000, // converts the gwei price to wei
		    //"nonce": nonce,
		    "nonce": "0x00",
		    "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
		 };

		console.log('gasPrices',gasPrices);
		console.log('details-before',details);

		var transaction,serializedTransaction,transactionId,url,getSenderAddress;
		transaction = new EthereumTx(details);
		transaction.sign( Buffer.from(privatekey, 'hex') );

		serializedTransaction = transaction.serialize();
		getSenderAddress = '0x' + transaction.getSenderAddress().toString('hex');

		console.log('serializedTransaction-before',serializedTransaction);
		console.log('getSenderAddress-before',getSenderAddress);

		web3.eth.getTransactionCount(getSenderAddress,function (error, result) {
			if (error) {
				console.log('error',error)
			} else {
				console.log('result',result);
				nonce = result;
				details.nonce = nonce;

				console.log('nonce',nonce);
				console.log('details-after',details);

				transaction = new EthereumTx(details);
				transaction.sign( Buffer.from(privatekey, 'hex') );

				serializedTransaction = transaction.serialize();
				getSenderAddress = '0x' + transaction.getSenderAddress().toString('hex');

				console.log('serializedTransaction-after',serializedTransaction);
				console.log('getSenderAddress-after',getSenderAddress);

				if(send){
					web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'), function (error, result) {
							if (error) {
								console.log('error',error);
								res.json({
									'response':'transaction' ,
									'params':body,
									'gasPrices':gasPrices,
									'getSenderAddress': getSenderAddress,
									'error': JSON.stringify(error)
								});
							} else {
								console.log('result',result);
								transactionId = result;

								url = "https://rinkeby.etherscan.io/tx/"+transactionId;
								console.log('transactionId',transactionId);
								console.log('url', url);

								res.json({
									'response':'transaction' ,
									//'params':body,
									'gasPrices':gasPrices,
									'transactionId' : transactionId,
									'transactionUrl': url,
									'getSenderAddress': getSenderAddress
								});
							}
						}
					);
				}else{
					res.json({
						'response':'transaction' ,
						//'params':body,
						'gasPrices':gasPrices,
						//'transactionId' : transactionId,
						//'transactionUrl': url,
						'getSenderAddress': getSenderAddress
					});
				}
				
			}
		});
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
