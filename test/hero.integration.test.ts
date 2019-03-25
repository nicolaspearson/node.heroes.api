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

	describe('#GET /hero', () => {
		it('should get the hero with an id of 1', done => {
			request(app.listener)
				.get('/hero?id=1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});

	describe('#GET /hero', () => {
		it('should fail to find a hero with an id of 1001', done => {
			request(app.listener)
				.get('/hero?id=1001')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});
	});
});
