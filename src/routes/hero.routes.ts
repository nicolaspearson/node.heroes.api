import Hapi from 'hapi';

import HeroActions from '@actions/hero.actions';

const routes = [
	{
		method: 'post',
		path: '/hero',
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return HeroActions.getInstance().createHero(request);
		}
	},
	{
		method: 'get',
		path: '/heroes',
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return HeroActions.getInstance().getHeroes(request);
		}
	},
	{
		method: 'get',
		path: '/hero',
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return HeroActions.getInstance().getHero(request);
		}
	},
	{
		method: 'put',
		path: '/hero/{id}',
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return HeroActions.getInstance().updateHero(request);
		}
	},
	{
		method: 'delete',
		path: '/hero/{id}',
		handler: async (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
			return HeroActions.getInstance().deleteHero(request);
		}
	}
];

module.exports = routes;
