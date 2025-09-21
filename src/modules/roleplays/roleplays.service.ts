import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleplayDto } from './dto/create-roleplay.dto';
import { UpdateRoleplayDto } from './dto/update-roleplay.dto';
import { Roleplay } from './entities/roleplay.entity';

@Injectable()
export class RoleplaysService {
  constructor(
    @InjectRepository(Roleplay)
    private roleplayRepository: Repository<Roleplay>,
  ) {}

  create(_: CreateRoleplayDto) {
    return 'This action adds a new roleplay';
  }

  findAll() {
    return this.roleplayRepository.find({
      relations: ['level', 'turns'],
    });
  }

  findOne(id: string) {
    return this.roleplayRepository.findOne({
      where: { id },
      relations: ['level', 'turns'],
    });
  }

  update(id: string, _: UpdateRoleplayDto) {
    return `This action updates a #${id} roleplay`;
  }

  remove(id: string) {
    return `This action removes a #${id} roleplay`;
  }
}
