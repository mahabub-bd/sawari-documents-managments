import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserActivityService } from 'src/user-activity/user-activity.service';
import { UserActivityModule } from 'src/user-activity/user-activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserActivityModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserActivityService],
  exports: [UsersService],
})
export class UsersModule {}
