import Hapi from 'hapi';
import request from 'supertest';

import { server } from '../src/index';
import { Hero } from '../src/models/hero.model';

describe('Hero API Integration Tests', () => {
	let app: Hapi.Server;
	let newHeroId: number | undefined;

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
				.expect(200)
				.end(err => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});

	describe('#GET /hero', () => {
		it('should get the hero with an id of 1', done => {
			request(app.listener)
				.get('/hero?id=1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(err => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});

	describe('#POST /hero', () => {
		it('should create a hero', done => {
			const hero = {
				name: 'The Hulk',
				identity: 'Bruce Banner',
				hometown: 'Chicago',
				age: 43
			};
			request(app.listener)
				.post('/hero')
				.send(hero)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect(res => {
					expect(res.body).toBeDefined();
					const newHero = Hero.newHero(res.body);
					expect(newHero).toBeDefined();
					newHeroId = newHero.id;
					expect(newHero.name).toEqual(hero.name);
					expect(newHero.identity).toEqual(hero.identity);
					expect(newHero.hometown).toEqual(hero.hometown);
					expect(newHero.age).toEqual(hero.age);
				})
				.end(err => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});

	describe('#PUT /hero', () => {
		it('should create a hero', done => {
			const hero = {
				id: newHeroId || 1,
				name: 'Hawkeye',
				identity: 'Clint Barton',
				hometown: 'Portland',
				age: 39
			};
			request(app.listener)
				.put(`/hero/${newHeroId || 1}`)
				.send(hero)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect(res => {
					expect(res.body).toBeDefined();
					const updatedHero = Hero.newHero(res.body);
					expect(updatedHero).toBeDefined();
					expect(updatedHero.id).toEqual(hero.id);
					expect(updatedHero.name).toEqual(hero.name);
					expect(updatedHero.identity).toEqual(hero.identity);
					expect(updatedHero.hometown).toEqual(hero.hometown);
					expect(updatedHero.age).toEqual(hero.age);
				})
				.end(err => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});

	describe('#DELETE /hero', () => {
		it(`should delete the hero with an id of ${newHeroId || 1}`, done => {
			request(app.listener)
				.delete(`/hero/${newHeroId || 1}`)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(err => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});
});
