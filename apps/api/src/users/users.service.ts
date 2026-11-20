import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserActivityService } from '../user-activity/user-activity.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userActivityService: UserActivityService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const user = await createdUser.save();
    await this.userActivityService.logActivity(
      user.id,
      'User Created',
      '/users',
    );
    return user;
  }

  async findAll(): Promise<{
    message: string;
    statusCode: number;
    data: UserDocument[];
  }> {
    const users = await this.userModel.find().exec();
    return {
      message: 'Users retrieved successfully',
      statusCode: 200,
      data: users,
    };
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
    path: string,
  ): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    await this.userActivityService.logActivity(userId, 'User Updated', path);
    return user;
  }

  async remove(
    id: string,
    userId: string,
    path: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    await this.userActivityService.logActivity(userId, 'User Deleted', path);
    return user;
  }
}
