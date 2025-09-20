import { Injectable } from '@nestjs/common';
import { CreateRoleplayDto } from './dto/create-roleplay.dto';
import { UpdateRoleplayDto } from './dto/update-roleplay.dto';

@Injectable()
export class RoleplaysService {
  create(createRoleplayDto: CreateRoleplayDto) {
    return 'This action adds a new roleplay';
  }

  findAll() {
    return `This action returns all roleplays`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roleplay`;
  }

  update(id: number, updateRoleplayDto: UpdateRoleplayDto) {
    return `This action updates a #${id} roleplay`;
  }

  remove(id: number) {
    return `This action removes a #${id} roleplay`;
  }
}
