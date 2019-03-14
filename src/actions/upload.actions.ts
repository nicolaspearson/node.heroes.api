import Boom from 'boom';
import * as fs from 'fs';
import Hapi from 'hapi';
import * as path from 'path';

import * as config from '@env';
import AppLogger from '@logger/app.logger';
import { Receipt } from '@models/receipt.model';
import ReceiptRepository from '@repositories/receipt.repository';
import ReceiptService from '@services/receipt.service';

export default class UploadActions {
	private static instance: UploadActions;
	// Create the receipt repository and service
	private static receiptRepository: ReceiptRepository;
	private static receiptService: ReceiptService;

	constructor() {
		if (!UploadActions.receiptRepository) {
			// Create the receipt repository and service
			UploadActions.receiptRepository = new ReceiptRepository();
			UploadActions.receiptService = new ReceiptService(UploadActions.receiptRepository);
		}
	}

	public static getInstance(): UploadActions {
		if (!this.instance) {
			AppLogger.logger.debug('Initialising upload actions');
			this.instance = new UploadActions();
		}
		return this.instance;
	}

	public async uploadReceipt(request: Hapi.Request): Promise<{}> {
		if (
			!request.headers['x-access-token'] ||
			!(request.headers['x-access-token'] === config.getServerConfig().ACCESS_TOKEN)
		) {
			throw Boom.unauthorized('Invalid API token');
		}

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
		AppLogger.logger.debug(`Uploading Receipt: ${filename}`);

		let receipt: Receipt;
		let foundReceipt: boolean = false;
		try {
			receipt = await UploadActions.receiptService.findOneByFilter({
				where: {
					uuid: payload.uuid
				}
			});
			AppLogger.logger.debug(`Found Existing Receipt: ${JSON.stringify(receipt)}`);
			foundReceipt = true;
		} catch (error) {
			// We were unable to find an existing receipt,
			// let's create one with the info we have
			receipt = Receipt.newReceipt({
				uuid: payload.uuid,
				vendor: 'Unknown',
				receiptDate: new Date()
			});
		}

		return new Promise((resolve, reject) => {
			const data = file._data;
			const filePath = path.resolve('uploads', filename);
			fs.writeFile(filePath, data, async err => {
				if (err) {
					reject(err);
				}
				const fileUrl = `/uploads/${filename}`;
				receipt.fileUrl = fileUrl;
				try {
					let newReceipt: Receipt;
					if (!foundReceipt) {
						newReceipt = await UploadActions.receiptService.save(receipt);
					} else {
						newReceipt = await UploadActions.receiptService.update(receipt, receipt.id);
					}
					resolve(newReceipt);
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
