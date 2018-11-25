import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';


//ethereum api 
import Web3 from 'web3';
import Wallet from 'ethereumjs-wallet/hdkey';
import bip39 from 'bip39';
import hdkey from 'hdkey';
import ethUtil from 'ethjs-util';
import EthereumTx from 'ethereumjs-tx';
import axios from 'axios';


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




//--------- start ether api -----------
async function connect_web3() {
	let web3, walletAddress = [],balance = 0;

	try{
		console.log('starting web3');
	 	web3 = await new Web3( new Web3.providers.HttpProvider("https://rinkeby.infura.io/P4692QP3VKFU6XTQDHV3H2WTWNBS137D2A"));
		//web3 = new Web3(new Web3.providers.HttpProvider("https://api.myetherapi.com/rin"));
		//web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));

		if (! web3.isConnected()){
			console.log('Somethings wrong...')
		}else{
			app.use( (req,res,next) => {
			    req.web3 = web3;
			    next();
			});
		}
	}catch(e){
		console.log('error',e);
	}

}
connect_web3();


async function getCurrentGasPrices() {
	let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
	let prices = {
	low: response.data.safeLow / 10,
	medium: response.data.average / 10,
	high: response.data.fast / 10
	}

	console.log('current gas prices', response.data);
	console.log('current gas prices', prices);

	let gasPrices = prices;

	let db  = {};

	//app.set('gasPrices', gasPrices);

	app.use( (req,res,next) => {
	    req.gasPrices = gasPrices;
	    next();
	});

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
}

getCurrentGasPrices();

export default app;



