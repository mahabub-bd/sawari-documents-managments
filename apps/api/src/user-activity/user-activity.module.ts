import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserActivity,
  UserActivitySchema,
} from './schemas/user-activity.schema';
import { UserActivityController } from './user-activity.controller';
import { UserActivityService } from './user-activity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserActivity.name, schema: UserActivitySchema },
    ]),
  ],
  controllers: [UserActivityController],
  providers: [UserActivityService],
  exports: [MongooseModule], // Only export MongooseModule once
})
export class UserActivityModule {}
