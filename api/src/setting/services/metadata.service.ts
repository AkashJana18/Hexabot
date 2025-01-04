/*
 * Copyright © 2025 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Metadata } from '../schemas/metadata.schema';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel(Metadata.name)
    private readonly metadataModel: Model<Metadata>,
  ) {}

  async createOrUpdate(dto: Metadata) {
    return await this.metadataModel.findOneAndUpdate({ name: dto.name }, dto, {
      upsert: true,
    });
  }

  async getMetadata(name: string) {
    return await this.metadataModel.findOne({ name });
  }

  async setMetadata(name: string, value: any) {
    return await this.metadataModel.updateOne({ name }, { $set: { value } });
  }
}
