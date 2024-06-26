import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { EntityManager } from 'typeorm';

// decorator options interface
export type IsUniqeInterface = {
  tableName: string;
  column: string;
  message?: string;
};

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // catch options from decorator
    const { tableName, column }: IsUniqeInterface = args.constraints[0];
    // get the current record's ID
    const currentId = args.object['currentId'];

    // database query check data is exists
    const queryBuilder = this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value });

    // if currentId is present, modify the query to ignore the current record
    if (currentId) {
      queryBuilder.andWhere('id != :id', { id: currentId });
    }

    const dataExist = await queryBuilder.getOne();

    return !dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    // return custom field message
    const field: string = validationArguments.property;
    if (validationArguments.constraints[0].message) {
      return validationArguments.constraints[0].message;
    }
    return `${field} ya existe`;
  }
}

// decorator function
export function IsUnique(
  options: IsUniqeInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
