import Boom from 'boom';
import * as fs from 'fs';
import Hapi from 'hapi';
import * as path from 'path';

import AppLogger from '@logger/app.logger';
import { Hero } from '@models/hero.model';
import HeroRepository from '@repositories/hero.repository';
import HeroService from '@services/hero.service';

export default class HeroActions {
	private static instance: HeroActions;
	// Create the hero repository and service
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

	public async heroHero(request: Hapi.Request): Promise<{}> {
		const payload: any = request.payload;
		if (!payload || !payload.file || !payload.uuid) {
			throw Boom.badRequest('Incorrect / invalid parameters supplied');
		}

		const file: any = payload.file;
		let filename: string = `${payload.uuid}`;
		if (file && file.hapi && file.hapi.filename) {
			const parts: string[] = file.hapi.filename.split('.');
			const extension = parts && parts.length > 1 ? '.' + parts[parts.length - 1] : '';
			filename = `${filename}${extension}`;
		}
		AppLogger.logger.debug(`Saving Hero: ${filename}`);

		let hero: Hero;
		let foundHero: boolean = false;
		try {
			hero = await HeroActions.heroService.findOneByFilter({
				where: {
					uuid: payload.uuid
				}
			});
			AppLogger.logger.debug(`Found Existing Hero: ${JSON.stringify(hero)}`);
			foundHero = true;
		} catch (error) {
			// We were unable to find an existing hero,
			// let's create one with the info we have
			hero = Hero.newHero({
				uuid: payload.uuid,
				vendor: 'Unknown',
				heroDate: new Date()
			});
		}

		return new Promise((resolve, reject) => {
			const data = file._data;
			const filePath = path.resolve('heros', filename);
			fs.writeFile(filePath, data, async err => {
				if (err) {
					reject(err);
				}
				const fileUrl = `/heros/${filename}`;
				hero.fileUrl = fileUrl;
				try {
					let newHero: Hero;
					if (!foundHero) {
						newHero = await HeroActions.heroService.save(hero);
					} else {
						newHero = await HeroActions.heroService.update(hero, hero.id);
					}
					resolve(newHero);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
