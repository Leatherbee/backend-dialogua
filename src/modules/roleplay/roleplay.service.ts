import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roleplay } from './entities/roleplay.entity';
import { CreateRoleplayDto, UpdateRoleplayDto } from './dto';

@Injectable()
export class RoleplayService {
  constructor(
    @InjectRepository(Roleplay)
    private readonly roleplayRepository: Repository<Roleplay>,
  ) {}

  async create(createRoleplayDto: CreateRoleplayDto): Promise<Roleplay> {
    const roleplay = this.roleplayRepository.create(createRoleplayDto);
    return await this.roleplayRepository.save(roleplay);
  }

  async findAll(): Promise<Roleplay[]> {
    return await this.roleplayRepository.find({
      relations: ['contentItem', 'turns'],
    });
  }

  async findByContentItem(contentItemId: number): Promise<Roleplay[]> {
    return await this.roleplayRepository.find({
      where: { content_item_id: contentItemId },
      relations: ['contentItem', 'turns'],
    });
  }

  async findOne(id: number): Promise<Roleplay> {
    const roleplay = await this.roleplayRepository.findOne({
      where: { id },
      relations: ['contentItem', 'turns'],
    });

    if (!roleplay) {
      throw new NotFoundException(`Roleplay with ID ${id} not found`);
    }

    return roleplay;
  }

  async update(
    id: number,
    updateRoleplayDto: UpdateRoleplayDto,
  ): Promise<Roleplay> {
    const roleplay = await this.findOne(id);
    Object.assign(roleplay, updateRoleplayDto);
    return await this.roleplayRepository.save(roleplay);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.roleplayRepository.softDelete(id);
  }
}
