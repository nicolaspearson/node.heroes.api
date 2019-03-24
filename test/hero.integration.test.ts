import Hapi from 'hapi';
import request from 'supertest';

import { server } from '../src/index';

describe('Hero API Integration Tests', () => {
	let app: Hapi.Server;
	describe('Init server', () => {
		it('should init the server', async done => {
			app = await server;
			expect(app).toBeDefined();
			expect(app.info.host).toEqual('localhost');
			done();
		});
	});

	describe('#GET /heroes', () => {
		it('should get all heroes', done => {
			request(app.listener)
				.get('/heroes')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
});
