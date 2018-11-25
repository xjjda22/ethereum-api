import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import wallets from './wallets';
import createWallet from './createWallet';
import getBalance from './getBalance';
import transaction from './transaction';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	//api.use('/facets', facets({ config, db }));

	// mount the wallets resource
	//api.use('/wallets', wallets({ config, db }));

	//create wallet
	api.use('/createWallet', createWallet({ config, db }));

	//getBalance
	api.use('/getBalance', getBalance({ config, db }));

	//transaction
	api.use('/transaction', transaction({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
