import { Injectable } from '@nestjs/common';
import { CreateSyncDto } from './dto/create-sync.dto';
import { UpdateSyncDto } from './dto/update-sync.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateData } from './entities/sync.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(UpdateData)
    private readonly updateDataRepo: Repository<UpdateData>,
  ) {}

  async getSyncStatus(since?: string) {
    const updates = await this.updateDataRepo.find();

    if (!since) {
      // Return all table timestamps if no 'since' parameter
      return updates.reduce(
        (acc, row) => {
          acc[row.tableName] = row.lastUpdatedAt;
          return acc;
        },
        {} as Record<string, Date>,
      );
    }

    // Check for updates since the specified date
    const sinceDate = new Date(since);
    const updatedTables = updates.filter(
      (row) => new Date(row.lastUpdatedAt) > sinceDate,
    );

    if (updatedTables.length === 0) {
      return { status: 'up-to-date' };
    }

    // Return only tables that have been updated since the specified date
    return updatedTables.reduce(
      (acc, row) => {
        acc[row.tableName] = row.lastUpdatedAt;
        return acc;
      },
      {} as Record<string, Date>,
    );
  }

  create(createSyncDto: CreateSyncDto) {
    return 'This action adds a new sync';
  }

  findAll() {
    return `This action returns all sync`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sync`;
  }

  update(id: number, updateSyncDto: UpdateSyncDto) {
    return `This action updates a #${id} sync`;
  }

  remove(id: number) {
    return `This action removes a #${id} sync`;
  }
}
