import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleplayAttempt } from './entities/roleplay-attempt.entity';
import { CreateRoleplayAttemptDto, UpdateRoleplayAttemptDto } from './dto';

@Injectable()
export class RoleplayAttemptService {
  constructor(
    @InjectRepository(RoleplayAttempt)
    private readonly roleplayAttemptRepository: Repository<RoleplayAttempt>,
  ) {}

  async create(
    createRoleplayAttemptDto: CreateRoleplayAttemptDto,
  ): Promise<RoleplayAttempt> {
    const roleplayAttempt = this.roleplayAttemptRepository.create(
      createRoleplayAttemptDto,
    );
    return await this.roleplayAttemptRepository.save(roleplayAttempt);
  }

  async findAll(): Promise<RoleplayAttempt[]> {
    return await this.roleplayAttemptRepository.find({
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<RoleplayAttempt[]> {
    return await this.roleplayAttemptRepository.find({
      where: { user_id: userId },
      relations: ['user'],
    });
  }

  async findByRoleplay(roleplayId: number): Promise<RoleplayAttempt[]> {
    return await this.roleplayAttemptRepository.find({
      where: { roleplay_id: roleplayId },
      relations: ['user'],
    });
  }

  async findByUserAndRoleplay(
    userId: string,
    roleplayId: number,
  ): Promise<RoleplayAttempt[]> {
    return await this.roleplayAttemptRepository.find({
      where: { user_id: userId, roleplay_id: roleplayId },
      relations: ['user'],
      order: { attempt_number: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RoleplayAttempt> {
    const roleplayAttempt = await this.roleplayAttemptRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!roleplayAttempt) {
      throw new NotFoundException(`RoleplayAttempt with ID ${id} not found`);
    }

    return roleplayAttempt;
  }

  async update(
    id: number,
    updateRoleplayAttemptDto: UpdateRoleplayAttemptDto,
  ): Promise<RoleplayAttempt> {
    const roleplayAttempt = await this.findOne(id);
    Object.assign(roleplayAttempt, updateRoleplayAttemptDto);

    if (updateRoleplayAttemptDto.completed && !roleplayAttempt.completed_at) {
      roleplayAttempt.completed_at = new Date();
    }

    return await this.roleplayAttemptRepository.save(roleplayAttempt);
  }

  async markCompleted(
    userId: string,
    roleplayId: number,
    score?: number,
    feedback?: string,
  ): Promise<RoleplayAttempt> {
    const attempts = await this.findByUserAndRoleplay(userId, roleplayId);
    const latestAttempt = attempts[0];

    if (!latestAttempt) {
      throw new NotFoundException(
        `No attempt found for user ${userId} and roleplay ${roleplayId}`,
      );
    }

    latestAttempt.completed = true;
    latestAttempt.completed_at = new Date();
    if (score !== undefined) latestAttempt.score = score;
    if (feedback) latestAttempt.feedback = feedback;

    return await this.roleplayAttemptRepository.save(latestAttempt);
  }

  async remove(id: number): Promise<void> {
    const roleplayAttempt = await this.findOne(id);
    await this.roleplayAttemptRepository.remove(roleplayAttempt);
  }
}
