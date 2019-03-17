import Boom from 'boom';
import { BaseService } from 'typeorm-infrastructure';

import { Hero } from '@models/hero.model';
import HeroRepository from '@repositories/hero.repository';

export default class HeroService extends BaseService<Hero> {
	constructor(private heroRepository: HeroRepository) {
		super(heroRepository);
	}

	public preSaveHook(hero: Hero): void {
		// Executed before the save repository call
		delete hero.id;
	}

	public preUpdateHook(hero: Hero) {
		// Executed before the update repository call
		delete hero.updatedAt;
	}

	public async softDelete(id: number): Promise<Hero> {
		try {
			if (!Hero.validId(id)) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			// Do a soft delete
			const heroResult: Hero = await this.heroRepository.findOneById(id);
			heroResult.deletedAt = new Date();

			await this.heroRepository.save(heroResult);
			return heroResult.sanitize();
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}
}
