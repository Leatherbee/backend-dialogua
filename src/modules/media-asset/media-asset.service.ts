import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { CreateMediaAssetDto, UpdateMediaAssetDto } from './dto';
import { MediaType } from '../../common/enums';

@Injectable()
export class MediaAssetService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly mediaAssetRepository: Repository<MediaAsset>,
  ) {}

  /**
   * Create a new media asset
   */
  async create(createMediaAssetDto: CreateMediaAssetDto): Promise<MediaAsset> {
    const mediaAsset = this.mediaAssetRepository.create(createMediaAssetDto);
    return await this.mediaAssetRepository.save(mediaAsset);
  }

  /**
   * Find all media assets
   */
  async findAll(): Promise<MediaAsset[]> {
    return await this.mediaAssetRepository.find();
  }

  /**
   * Find media assets by type
   */
  async findByType(mediaType: MediaType): Promise<MediaAsset[]> {
    return await this.mediaAssetRepository.find({
      where: { media_type: mediaType },
    });
  }

  /**
   * Find one media asset by ID
   */
  async findOne(id: number): Promise<MediaAsset> {
    const mediaAsset = await this.mediaAssetRepository.findOne({
      where: { id },
    });

    if (!mediaAsset) {
      throw new NotFoundException(`MediaAsset with ID ${id} not found`);
    }

    return mediaAsset;
  }

  /**
   * Update a media asset
   */
  async update(
    id: number,
    updateMediaAssetDto: UpdateMediaAssetDto,
  ): Promise<MediaAsset> {
    const mediaAsset = await this.findOne(id);
    Object.assign(mediaAsset, updateMediaAssetDto);
    return await this.mediaAssetRepository.save(mediaAsset);
  }

  /**
   * Remove a media asset (soft delete)
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.mediaAssetRepository.softDelete(id);
  }
}
