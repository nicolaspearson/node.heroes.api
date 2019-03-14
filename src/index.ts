import 'module-alias/register';
import 'reflect-metadata';

import * as Blipp from 'blipp';
import Hapi from 'hapi';
import * as path from 'path';

import { Database } from '@db/app.db';
import * as config from '@env';
import AppLogger from '@logger/app.logger';
import { SystemUtils } from '@utils/system.utils';

// Setup environment config
config.init();

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
	await init();

	const host: any = config.getServerConfig().API_HOST;
	const port: any = config.getServerConfig().API_PORT;

	// Create the Hapi server
	const server: Hapi.Server = new Hapi.Server({
		port,
		host,
		debug: { request: ['error'] },
		routes: {
			cors: {
				additionalHeaders: ['x-access-token'],
				origin: ['http://localhost:3000']
			}
		}
	});

	// Auto route discovery
	await server.register(
		{
			plugin: require('wurst'),
			options: {
				routes: '*.routes.js',
				cwd: path.join(__dirname, 'routes'),
				log: false
			}
		},
		{
			routes: {
				prefix: config.getServerConfig().ROUTE_PREFIX
			}
		}
	);

	// Route table console output
	await server.register(Blipp);

	// Enriched console output
	await server.register({
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

	await server.start();
	return server;
}

start()
	.then(server => {
		AppLogger.logger.debug(`Server running at: ${server.info.uri}`);
	})
	.catch(error => {
		AppLogger.logger.error(`Server failed: ${JSON.stringify(error)}`);
	});
