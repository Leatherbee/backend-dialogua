import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: UUID): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByAppleId(appleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { appleId } });
  }

  async update(id: UUID, updateUserDto: any): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }

  async remove(id: UUID): Promise<void> {
    await this.userRepository.delete(id);
  }
}
