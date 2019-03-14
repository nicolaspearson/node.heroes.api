import { BaseRepository } from 'typeorm-infrastructure';

import { Receipt } from '@models/receipt.model';

export default class ReceiptRepository extends BaseRepository<Receipt> {
	constructor() {
		super(Receipt.name);
	}
}
