import Boom from 'boom';
import { Length, validate, ValidationArguments, ValidationError } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'hero' })
export class Hero {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ name: 'name', length: 500 })
	@Length(1, 500, {
		message: (args: ValidationArguments) => {
			return Hero.getGenericValidationLengthMessage(args);
		}
	})
	public name: string;

	@Column({ name: 'identity', length: 500 })
	@Length(1, 500, {
		message: (args: ValidationArguments) => {
			return Hero.getGenericValidationLengthMessage(args);
		}
	})
	public identity: string;

	@Column({ name: 'hometown', length: 500 })
	@Length(1, 500, {
		message: (args: ValidationArguments) => {
			return Hero.getGenericValidationLengthMessage(args);
		}
	})
	public hometown: string;

	@Column({ name: 'age' })
	public age: number;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
	public updatedAt: Date;

	@Column({ name: 'deleted_at', type: 'timestamp with time zone' })
	public deletedAt: Date;

	public static newHero(obj: {
		id?: number;
		name?: string;
		identity?: string;
		hometown?: string;
		age?: number;
		createdAt?: Date;
		updatedAt?: Date;
		deletedAt?: Date;
	}) {
		return { ...new Hero(), ...obj };
		// if (obj.id) {
		// 	newObject.id = obj.id;
		// }
		// if (obj.name) {
		// 	newObject.name = obj.name;
		// }
		// if (obj.fileUrl) {
		// 	newObject.fileUrl = obj.fileUrl;
		// }
		// if (obj.vendor) {
		// 	newObject.vendor = obj.vendor;
		// }
		// if (obj.userId) {
		// 	newObject.userId = obj.userId;
		// }
		// if (obj.heroDate) {
		// 	newObject.heroDate = obj.heroDate;
		// }
		// if (obj.createdAt) {
		// 	newObject.createdAt = obj.createdAt;
		// }
		// if (obj.updatedAt) {
		// 	newObject.updatedAt = obj.updatedAt;
		// }
		// if (obj.deletedAt) {
		// 	newObject.deletedAt = obj.deletedAt;
		// }
		// return newObject;
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

	public sanitize(): Hero {
		delete this.deletedAt;
		return this;
	}

	public static getGenericValidationLengthMessage(args: ValidationArguments) {
		const chars: any = args.value !== undefined ? args.value.length : args.constraints[0];
		return 'Incorrect length: Found ' + chars + ' characters';
	}
}
