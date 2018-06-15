import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

var Web3,web3,walletAddress = [],balance = 0;

Web3 = require('web3');
try{
	console.log('starting web3');
 	web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/P4692QP3VKFU6XTQDHV3H2WTWNBS137D2A"));
	//web3 = new Web3(new Web3.providers.HttpProvider("https://api.myetherapi.com/rin"));
	//web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));

	if (! web3.isConnected()){
		console.log('Somethings wrong...')
	}
}catch(e){
	console.log('error',e);
}

//var Wallet = require('ethereumjs-wallet');
var Wallet = require('ethereumjs-wallet/hdkey');
var bip39 = require('bip39');
var hdkey = require('hdkey');
var ethUtil = require('ethjs-util');


var EthereumTx, axios;
EthereumTx = require('ethereumjs-tx');
axios = require('axios')


async function getCurrentGasPrices() {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  }

  console.log('current gas prices', response.data);
  console.log('current gas prices', prices);

  global.gasPrices = prices;
}
getCurrentGasPrices();

var details,nonce;

//gasPrices = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
// gasPrices= {
// 	"average_txpool": 20.0,
// 	"fastest": 200.0,
// 	"fastestWait": 0.5,
// 	"fastWait": 0.5,
// 	"block_time": 15.801020408163266,
// 	"safeLowWait": 1.4,
// 	"fast": 50.0,
// 	"blockNum": 5506380,
// 	"safelow_calc": 10.0,
// 	"speed": 0.8952534123391631,
// 	"safelow_txpool": 20.0,
// 	"safeLow": 20.0,
// 	"average": 20.0,
// 	"avgWait": 1.4,
// 	"average_calc": 20.0
// };



// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));



	app.get('/createWallet/:path/:coin/:index', (req, res) => {
		
		var wallet,cwallet,new_privatekey,new_address;
		var mnemonic,seed;
		var xpriv,xpub;
		var path,index;
		
		//wallet = Wallet.generate(true);
		//new_privatekey = wallet.getPrivateKey().toString('hex');
		//new_address = '0x'+wallet.getAddress().toString('hex');

		//sample generated address
		// {
		//     "response": "createWallet",
		//     "path": "m/32/60'/0'/0",
		//     "index": "1",
		//     "mnemonic": "cook balance apple fork swallow early program refuse vicious month patient viable",
		//     "seed": "c25ddd9ed2d41cfdd0f0c54164d94097ad0b023a027cff1a1a991559c9beb51574efd84b46890602c7f0c1a016ccb27bc5b4af353c1e81b2e3532924322c7824",
		//     "xpriv": "xprvA3H5bbC9Lh9xd74nUYLgjiKNUUkdZnWWE2DxR6vLzjNCwcPdSpvFpDRbSmQUADriW2MJRwZqqYh5tBcZJxn1U82N3wZuys4GMQE94PTcp6M",
		//     "xpub": "xpub6GGS16j3B4iFqb9FaZsh6rG72Wb7yFEMbF9ZDVKxZ4uBpQimzNEWN1k5J2PZfNrfBFDTRPtsR5iELcFbH2QjDpkRDa6izGTy92itiDTM5WE",
		//     "address": "0xa72f80fad5bb647a78fb9e4ed5bbcf816ecd5c08",
		//     "privatekey": "b1fc945c374b8e6eaced003020e52c366e40d9d3c49960bbe27204bf529d9c50"
		// }
		// {
		//     "response": "createWallet",
		//     "path": "m/44/60'/0'/0",
		//     "index": "1",
		//     "mnemonic": "cook balance apple fork swallow early program refuse vicious month patient viable",
		//     "seed": "c25ddd9ed2d41cfdd0f0c54164d94097ad0b023a027cff1a1a991559c9beb51574efd84b46890602c7f0c1a016ccb27bc5b4af353c1e81b2e3532924322c7824",
		//     "xpriv": "xprvA2gZUMH7fBWMceLwYGme1dwxuMRtyMByo48JiQkvFtxCgWeYfbHuyRJRAW67qug7NXDZZVK5HRf59Nnd9okE2XaYcSNVv2kk7199yVXFXJa",
		//     "xpub": "xpub6Ffusrp1VZ4eq8RQeJJeNmthTPGPNouqAH3uWoAXpEVBZJyhD8cAXDcu1npZxgfwoihePUESf62nnVY7xizyKDKuQs58XuviQoFzKxzvzTD",
		//     "address": "0xed05e50236cccf2cc403ba4ac6885e457d617c33",
		//     "privatekey": "57341b3fde45ed8c9169996946ee4ce99203ee18ee94189f4639db0842e6d1e3"
		// }
		// {
		//     "response": "createWallet",
		//     "path": "m/44'/60'/0'/0",
		//     "index": "0",
		//     "mnemonic": "cook balance apple fork swallow early program refuse vicious month patient viable",
		//     "seed": "c25ddd9ed2d41cfdd0f0c54164d94097ad0b023a027cff1a1a991559c9beb51574efd84b46890602c7f0c1a016ccb27bc5b4af353c1e81b2e3532924322c7824",
		//     "xpriv": "xprvA2WomLTHw3ox7tNwDJkU5ijxfkBNXBfDnGmVAarKiKk4mPDtr1cYfzUHsHQV4Ex3nd9h8LPLC8PwMb9pHQY1HRmC8UnjNEbrHNf2YhYetnu",
		//     "xpub": "xpub6FWAAqzBmRNFLNTQKLHUSrghDn1rveP59Vh5xyFwGfH3eBZ3PYvoDnnmiZm5q4Ni8KY3QdnknRVVAhZqCuovpictbjWp7RHaFKE4e3E17mu",
		//     "address": "0x85ae881433ba05d86b919a0dca7a63f0fe454259",
		//     "privatekey": "4470868eeeac5aeae70034caf550e406df0f053ff1fdf406359be397b06e4159"
		// }


		console.log('params',req.params);

		//path = "m/32/60'/0'/0";
		path = "m/"+req.params.path+"/"+req.params.coin+"'/0'/0";
		index = req.params.index,

		//mnemonic = bip39.generateMnemonic(); //generates string
		mnemonic = 'cook balance apple fork swallow early program refuse vicious month patient viable';
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

		// path = "m/44'/60'/0'/0";

		// //mnemonic = bip39.generateMnemonic(); //generates string
		// mnemonic = 'cook balance apple fork swallow early program refuse vicious month patient viable';
	 // 	seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer

	 // 	console.log('mnemonic',mnemonic);
		// console.log('seed',seed);
	 	
	 // 	wallet = Wallet.fromMasterSeed(seed);
	 // 	wallet = wallet.derivePath(path);
	 // 	xpriv = wallet.privateExtendedKey();
	 // 	xpub = wallet.publicExtendedKey();

	 // 	wallet = wallet.deriveChild(0);
	 // 	cwallet = wallet.getWallet();

	 // 	xpriv = wallet.privateExtendedKey();
	 // 	xpub = wallet.publicExtendedKey();

	 // 	new_privatekey = cwallet.getPrivateKey().toString('hex');
		// new_address = '0x'+cwallet.getAddress().toString('hex');

		

		

		console.log('wallet',wallet);
		console.log('cwallet',cwallet);
		console.log('new_privatekey',new_privatekey);
		console.log('new_address',new_address);


		res.json({
			'response':'createWallet',
			'path':path,
			'index':index,
			'mnemonic':mnemonic,
			'seed':seed.toString('hex'),
			'xpriv':xpriv,
			'xpub':xpub,
			'address':new_address,
			'privatekey':new_privatekey
		});
	});



	app.get('/getBalance/:address', (req, res) => {

		console.log('req',req.params);

		web3.eth.getBalance(req.params.address, function (error, result) {
			if (error) {
				console.log('error',error)

				res.json({
		      		'response':'getBalance' ,
		      		'error':JSON.stringify(error)
		      	});
			} else {
				console.log('result',result.toString());
				balance = web3.fromWei(result.toString(), 'ether');
				console.log('balance',balance);

				res.json({
		      		'response':'getBalance' ,
		      		'balance':balance
		      	});
			}
	    });


	});

	//params {privateKey, destination, amount}
	app.post('/transaction', (req, res) => {

		console.log('req',req.body);

		var privatekey, destination, amount, send;
		privatekey = req.body.privatekey;
		destination = req.body.destination;
		amount = req.body.amount;
		send = req.body.send;

		details = {
		    "to": destination,
		    "value": web3.toHex( web3.toWei(amount, 'ether') ),
		    "gas": 21000,
		    "gasPrice": global.gasPrices.low * 1000000000, // converts the gwei price to wei
		    //"nonce": nonce,
		    "nonce": "0x00",
		    "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
		 };

		console.log('gasPrices',global.gasPrices);
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
								console.log('error',error)
							} else {
								console.log('result',result);
								transactionId = result;

								url = "https://rinkeby.etherscan.io/tx/"+transactionId;
								console.log('transactionId',transactionId);
								console.log('url', url);

								res.json({
									'response':'transaction' ,
									'params':req.body,
									'gasPrices':global.gasPrices,
									'transactionId' : transactionId,
									'transactionUrl': url,
									'getSenderAddress': getSenderAddress
								});
							}
						}
					);
				}
				
			}
		});

	});

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;



