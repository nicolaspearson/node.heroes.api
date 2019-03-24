import 'module-alias/register';
import 'reflect-metadata';

import * as Blipp from 'blipp';
import * as dotenv from 'dotenv';
import Hapi from 'hapi';
import * as path from 'path';

import { Database } from '@db/app.db';
import * as config from '@env';
import AppLogger from '@logger/app.logger';
import * as SystemUtils from '@utils/system.utils';

// Setup environment config
dotenv.config();
config.init();

const isTestEnv = process.env.NODE_ENV === 'test';

async function init() {
	// Setup the logger
	const appLogger = new AppLogger();
	appLogger.setupAppLogger();

	AppLogger.logger.debug('Waiting for database...');
	await SystemUtils.sleep(config.getServerConfig().DB_DELAY);

	// Connect to the database
	const database: Database = new Database();
	try {
		await database.setupDatabase();
	} catch (error) {
		AppLogger.logger.error(`Database connection failed: ${JSON.stringify(error)}`);
		throw error;
	}
}

async function start(): Promise<Hapi.Server> {
	const host: any = config.getServerConfig().API_HOST;
	const port: any = config.getServerConfig().API_PORT;

	// Create the Hapi server
	const hapiServer: Hapi.Server = new Hapi.Server({
		port,
		host,
		debug: { request: ['error'] },
		routes: {
			cors: {
				additionalHeaders: ['x-access-token'],
				origin: ['*']
			}
		}
	});

	// Auto route discovery
	await hapiServer.register({
		plugin: require('wurst'),
		options: {
			routes: !isTestEnv ? '*.routes.js' : '*.routes.ts',
			cwd: path.join(__dirname, 'routes'),
			log: false
		}
	});

	// Route table console output
	await hapiServer.register(Blipp);

	// Enriched console output
	await hapiServer.register({
		plugin: require('good'),
		options: {
			reporters: {
				console: [
					{
						module: 'good-squeeze',
						name: 'Squeeze',
						args: [
							{
								log: '*',
								request: '*',
								response: '*',
								error: '*'
							}
						]
					},
					{
						module: 'good-console'
					},
					'stdout'
				]
			}
		}
	});

	if (!isTestEnv) {
		await hapiServer.start();
	}

	AppLogger.logger.debug(`Server running at: ${hapiServer.info.uri}`);
	return hapiServer;
}

export const server = (async () => {
	try {
		await init();
		return await start();
	} catch (error) {
		AppLogger.logger.error(`Server failed: ${JSON.stringify(error)}`);
		throw error;
	}
})();
