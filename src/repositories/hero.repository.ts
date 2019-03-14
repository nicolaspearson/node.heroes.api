import { BaseRepository } from 'typeorm-infrastructure';

import { Hero } from '@models/hero.model';

export default class HeroRepository extends BaseRepository<Hero> {
	constructor() {
		super(Hero.name);
	}
}
