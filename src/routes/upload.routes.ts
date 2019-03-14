import Hapi from 'hapi';

import UploadActions from '@actions/upload.actions';

const routes = [
	{
		method: 'post',
		path: '/upload/receipt',
		options: {
			payload: {
				output: 'stream'
			}
		},
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return UploadActions.getInstance().uploadReceipt(request);
		}
	}
];

module.exports = routes;
