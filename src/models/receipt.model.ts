import Boom from 'boom';
import {
	IsOptional,
	Length,
	validate,
	ValidationArguments,
	ValidationError
} from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'receipt' })
export class Receipt {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ name: 'uuid', length: 50 })
	@Length(1, 50, {
		message: (args: ValidationArguments) => {
			return Receipt.getGenericValidationLengthMessage(args);
		}
	})
	public uuid: string;

	@Column({ name: 'file_url' })
	@IsOptional()
	public fileUrl?: string;

	@Column({ name: 'vendor', length: 500 })
	@Length(1, 500, {
		message: (args: ValidationArguments) => {
			return Receipt.getGenericValidationLengthMessage(args);
		}
	})
	public vendor: string;

	@Column({ name: 'user_id' })
	@IsOptional()
	public userId?: number;

	@Column({ name: 'receipt_date', type: 'timestamp with time zone' })
	public receiptDate: Date;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
	public updatedAt: Date;

	@Column({ name: 'deleted_at', type: 'timestamp with time zone' })
	public deletedAt: Date;

	public static newReceipt(obj: {
		id?: number;
		uuid?: string;
		fileUrl?: string;
		vendor?: string;
		userId?: number;
		receiptDate?: Date;
		createdAt?: Date;
		updatedAt?: Date;
		deletedAt?: Date;
	}) {
		const newObject = new Receipt();
		if (obj.id) {
			newObject.id = obj.id;
		}
		if (obj.uuid) {
			newObject.uuid = obj.uuid;
		}
		if (obj.fileUrl) {
			newObject.fileUrl = obj.fileUrl;
		}
		if (obj.vendor) {
			newObject.vendor = obj.vendor;
		}
		if (obj.userId) {
			newObject.userId = obj.userId;
		}
		if (obj.receiptDate) {
			newObject.receiptDate = obj.receiptDate;
		}
		if (obj.createdAt) {
			newObject.createdAt = obj.createdAt;
		}
		if (obj.updatedAt) {
			newObject.updatedAt = obj.updatedAt;
		}
		if (obj.deletedAt) {
			newObject.deletedAt = obj.deletedAt;
		}
		return newObject;
	}

	public static validId(id: number): boolean {
		return id !== undefined && id > 0;
	}

	public async isValid(): Promise<boolean> {
		try {
			const errors: ValidationError[] = await validate(this, {
				validationError: { target: false, value: false }
			});
			if (errors.length > 0) {
				throw Boom.badRequest('Validation failed on the provided request', errors);
			}
			return true;
		} catch (error) {
			if (Boom.isBoom(error)) {
				throw Boom.boomify(error);
			}
			throw Boom.badRequest('Unable to validate request: ' + error);
		}
	}

	public sanitize(): Receipt {
		delete this.deletedAt;
		return this;
	}

	public static getGenericValidationLengthMessage(args: ValidationArguments) {
		const chars: any = args.value !== undefined ? args.value.length : args.constraints[0];
		return 'Incorrect length: Found ' + chars + ' characters';
	}
}
