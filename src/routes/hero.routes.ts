import Hapi from 'hapi';

import HeroActions from '@actions/hero.actions';

const routes = [
	{
		method: 'post',
		path: '/hero/hero',
		options: {
			payload: {
				output: 'stream'
			}
		},
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return HeroActions.getInstance().heroHero(request);
		}
	}
];

module.exports = routes;
