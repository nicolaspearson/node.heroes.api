import Boom from 'boom';
import Hapi from 'hapi';

import AppLogger from '@logger/app.logger';
import { Hero } from '@models/hero.model';
import HeroRepository from '@repositories/hero.repository';
import HeroService from '@services/hero.service';

export default class HeroActions {
	private static instance: HeroActions;
	private static heroRepository: HeroRepository;
	private static heroService: HeroService;

	constructor() {
		if (!HeroActions.heroRepository) {
			// Create the hero repository and service
			HeroActions.heroRepository = new HeroRepository();
			HeroActions.heroService = new HeroService(HeroActions.heroRepository);
		}
	}

	public static getInstance(): HeroActions {
		if (!this.instance) {
			AppLogger.logger.debug('Initializing hero actions');
			this.instance = new HeroActions();
		}
		return this.instance;
	}

	public async getHero(request: Hapi.Request): Promise<Hero> {
		let id: number;
		try {
			id = parseInt(request.query instanceof Array ? request.query[0] : request.query.id, 10);
			if (id < 1) {
				throw new Error('Invalid Id');
			}
		} catch (error) {
			throw Boom.badRequest('Incorrect / invalid parameters supplied');
		}
		return await HeroActions.heroService.findOneById(id);
	}

	public async getHeroes(request: Hapi.Request): Promise<Hero[]> {
		return await HeroActions.heroService.findAll();
	}

	public async createHero(request: Hapi.Request): Promise<Hero> {
		const payload: any = request.payload;
		if (!payload) {
			throw Boom.badRequest('Incorrect / invalid parameters supplied');
		}

		AppLogger.logger.debug(`Saving Hero: ${request.payload}`);

		let hero: Hero | undefined;
		try {
			hero = await HeroActions.heroService.findOneByFilter({
				where: {
					uuid: payload.name
				}
			});
			AppLogger.logger.debug(`Found Existing Hero: ${JSON.stringify(hero)}`);
		} catch (error) {
			// We were unable to find an existing hero, continue...
		}

		if (!hero) {
			return await HeroActions.heroService.save(payload);
		} else {
			return await HeroActions.heroService.update(payload, hero.id);
		}
	}

	public async updateHero(request: Hapi.Request): Promise<Hero> {
		const payload: any = request.payload;
		if (!payload || !request.params.id) {
			throw Boom.badRequest('Incorrect / invalid parameters supplied');
		}

		let id: number;
		try {
			id = parseInt(request.params.id, 10);
			if (id < 1) {
				throw new Error('Invalid Id');
			}
		} catch (error) {
			throw Boom.badRequest('Incorrect / invalid parameters supplied');
		}

		// Ensure the record exists
		await HeroActions.heroService.findOneByFilter({
			where: {
				id
			}
		});
		return await HeroActions.heroService.update(payload, id);
	}

	public async deleteHero(request: Hapi.Request): Promise<Hero> {
		let id: number;
		try {
			id = parseInt(request.params.id, 10);
			if (id < 1) {
				throw new Error('Invalid Id');
			}
		} catch (error) {
			throw Boom.badRequest('Incorrect / invalid parameters supplied');
		}

		// Ensure the record exists
		await HeroActions.heroService.findOneByFilter({
			where: {
				id
			}
		});
		return await HeroActions.heroService.delete(id);
	}
}
