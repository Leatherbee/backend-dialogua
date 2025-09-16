import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: UUID): Promise<User | null> {
    return this.userRepository.findOneById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: UUID): Promise<void> {
    return this.userRepository.remove(id);
  }
}
