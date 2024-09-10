/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { FieldType } from '../dto/contentType.dto';

@ValidatorConstraint({ name: 'validateRequiredFields', async: false })
export class ValidateRequiredFields implements ValidatorConstraintInterface {
  private readonly REQUIRED_FIELDS: FieldType[] = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'checkbox',
    },
  ];

  validate(fields: FieldType[]): boolean {
    const errors: string[] = [];

    this.REQUIRED_FIELDS.forEach((requiredField, index) => {
      const field = fields[index];

      if (!field) {
        errors.push(`Field ${requiredField.name} is required.`);
        return;
      }

      Object.entries(requiredField).forEach(([key, value]) => {
        if (field[key] !== value) {
          errors.push(
            `fields.${index}.${key} must be ${value}, but got ${field[key]}`,
          );
        }
      });
    });

    if (errors.length > 0) {
      throw new BadRequestException({ message: errors });
    }

    return true;
  }

  defaultMessage(): string {
    return 'The fields must match the required structure.';
  }
}
