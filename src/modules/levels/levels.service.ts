import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const unlinkAsync = promisify(unlink);

@Injectable()
export class LevelsService {
  private readonly uploadPath = join(process.cwd(), 'uploads/levels/banners');

  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const level = this.levelRepository.create({
      ...createLevelDto,
      id: uuidv4(),
      banner: createLevelDto.banner || null,
    });
    return await this.levelRepository.save(level);
  }

  async findAll(): Promise<Level[]> {
    return await this.levelRepository.find({
      order: { level: 'ASC' },
      where: { deletedAt: null },
    });
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.levelRepository.findOne({ 
      where: { id, deletedAt: null } 
    });
    
    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
    
    return level;
  }

  async update(id: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
    const level = await this.findOne(id);
    
    // Handle banner removal
    if (updateLevelDto.removeBanner && level.banner) {
      await this.deleteBannerFile(level.banner);
      level.banner = null;
    }

    // Handle new banner upload
    if (updateLevelDto.banner) {
      // Delete old banner if exists
      if (level.banner) {
        await this.deleteBannerFile(level.banner);
      }
      level.banner = updateLevelDto.banner;
    }

    // Update other fields
    if (updateLevelDto.level !== undefined) level.level = updateLevelDto.level;
    if (updateLevelDto.type) level.type = updateLevelDto.type;
    
    return await this.levelRepository.save(level);
  }

  async remove(id: string): Promise<void> {
    const level = await this.findOne(id);
    
    // Delete the banner file if it exists
    if (level.banner) {
      await this.deleteBannerFile(level.banner);
    }
    
    await this.levelRepository.softDelete(id);
  }

  private async deleteBannerFile(filename: string): Promise<void> {
    const filePath = join(this.uploadPath, filename);
    
    if (existsSync(filePath)) {
      try {
        await unlinkAsync(filePath);
      } catch (err) {
        console.error(`Error deleting banner file ${filename}:`, err);
        throw new BadRequestException('Failed to delete banner file');
      }
    }
  }
}
