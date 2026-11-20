import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BikeInformationController } from './bike-information.controller';
import { BikeInformationService } from './bike-information.service';
import {
  BikeInformation,
  BikeInformationSchema,
} from './schemas/bike-information.schema';
import { UserActivityService } from 'src/user-activity/user-activity.service';
import { UserActivityModule } from 'src/user-activity/user-activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BikeInformation.name, schema: BikeInformationSchema },
    ]),
    UserActivityModule,
  ],
  controllers: [BikeInformationController],
  providers: [BikeInformationService, UserActivityService],
  exports: [MongooseModule],
})
export class BikeInformationModule {}
