import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentItem } from './entities/content-item.entity';
import { CreateContentItemDto, UpdateContentItemDto } from './dto';
import { ContentType } from '../../common/enums';

@Injectable()
export class ContentItemService {
  constructor(
    @InjectRepository(ContentItem)
    private readonly contentItemRepository: Repository<ContentItem>,
  ) {}

  /**
   * Create a new content item
   */
  async create(
    createContentItemDto: CreateContentItemDto,
  ): Promise<ContentItem> {
    const contentItem = this.contentItemRepository.create(createContentItemDto);
    return await this.contentItemRepository.save(contentItem);
  }

  /**
   * Find all content items
   */
  async findAll(): Promise<ContentItem[]> {
    return await this.contentItemRepository.find({
      relations: ['unitLevel', 'mediaAsset'],
      order: { position: 'ASC' },
    });
  }

  /**
   * Find content items by unit level
   */
  async findByUnitLevel(unitLevelId: number): Promise<ContentItem[]> {
    return await this.contentItemRepository.find({
      where: { unit_level_id: unitLevelId },
      relations: ['unitLevel', 'mediaAsset'],
      order: { position: 'ASC' },
    });
  }

  /**
   * Find content items by type
   */
  async findByType(contentType: ContentType): Promise<ContentItem[]> {
    return await this.contentItemRepository.find({
      where: { content_type: contentType },
      relations: ['unitLevel', 'mediaAsset'],
      order: { position: 'ASC' },
    });
  }

  /**
   * Find one content item by ID
   */
  async findOne(id: number): Promise<ContentItem> {
    const contentItem = await this.contentItemRepository.findOne({
      where: { id },
      relations: ['unitLevel', 'mediaAsset'],
    });

    if (!contentItem) {
      throw new NotFoundException(`ContentItem with ID ${id} not found`);
    }

    return contentItem;
  }

  /**
   * Update a content item
   */
  async update(
    id: number,
    updateContentItemDto: UpdateContentItemDto,
  ): Promise<ContentItem> {
    const contentItem = await this.findOne(id);
    Object.assign(contentItem, updateContentItemDto);
    return await this.contentItemRepository.save(contentItem);
  }

  /**
   * Remove a content item (soft delete)
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.contentItemRepository.softDelete(id);
  }
}
