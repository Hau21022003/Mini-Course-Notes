import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    this.validatePassword(createUserDto.password);
    const hash = await this.hashData(createUserDto.password);
    return await this.usersRepository.save({
      ...createUserDto,
      password: hash,
    });
  }

  async update(id: string, updateData: Partial<User>) {
    if (updateData.password) {
      this.validatePassword(updateData.password);
    }
    return await this.usersRepository.update(id, updateData);
  }

  private async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(data, salt);
  }

  private validatePassword(password: string) {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Must contain at least one special character');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
