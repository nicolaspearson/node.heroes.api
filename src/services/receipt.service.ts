import Boom from 'boom';
import { BaseService } from 'typeorm-infrastructure';

import { Receipt } from '@models/receipt.model';
import ReceiptRepository from '@repositories/receipt.repository';

export default class ReceiptService extends BaseService<Receipt> {
	constructor(private receiptRepository: ReceiptRepository) {
		super(receiptRepository);
	}

	public preSaveHook(receipt: Receipt): void {
		// Executed before the save repository call
	}

	public preUpdateHook(receipt: Receipt) {
		// Executed before the update repository call
		delete receipt.updatedAt;
	}

	public async softDelete(id: number): Promise<Receipt> {
		try {
			if (!Receipt.validId(id)) {
				throw Boom.badRequest('Incorrect / invalid parameters supplied');
			}
			// Do a soft delete
			const receiptResult: Receipt = await this.receiptRepository.findOneById(id);
			receiptResult.deletedAt = new Date();

			await this.receiptRepository.save(receiptResult);
			return receiptResult.sanitize();
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.internal(error);
		}
	}
}
