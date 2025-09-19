import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleplayTurn } from './entities/roleplay-turn.entity';
import { CreateRoleplayTurnDto, UpdateRoleplayTurnDto } from './dto';

@Injectable()
export class RoleplayTurnService {
  constructor(
    @InjectRepository(RoleplayTurn)
    private readonly roleplayTurnRepository: Repository<RoleplayTurn>,
  ) {}

  async create(
    createRoleplayTurnDto: CreateRoleplayTurnDto,
  ): Promise<RoleplayTurn> {
    const roleplayTurn = this.roleplayTurnRepository.create(
      createRoleplayTurnDto,
    );
    return await this.roleplayTurnRepository.save(roleplayTurn);
  }

  async findAll(): Promise<RoleplayTurn[]> {
    return await this.roleplayTurnRepository.find({
      relations: ['roleplay'],
      order: { turn_order: 'ASC' },
    });
  }

  async findByRoleplay(roleplayId: number): Promise<RoleplayTurn[]> {
    return await this.roleplayTurnRepository.find({
      where: { roleplay_id: roleplayId },
      relations: ['roleplay'],
      order: { turn_order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RoleplayTurn> {
    const roleplayTurn = await this.roleplayTurnRepository.findOne({
      where: { id },
      relations: ['roleplay'],
    });

    if (!roleplayTurn) {
      throw new NotFoundException(`RoleplayTurn with ID ${id} not found`);
    }

    return roleplayTurn;
  }

  async update(
    id: number,
    updateRoleplayTurnDto: UpdateRoleplayTurnDto,
  ): Promise<RoleplayTurn> {
    const roleplayTurn = await this.findOne(id);
    Object.assign(roleplayTurn, updateRoleplayTurnDto);
    return await this.roleplayTurnRepository.save(roleplayTurn);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.roleplayTurnRepository.softDelete(id);
  }
}
