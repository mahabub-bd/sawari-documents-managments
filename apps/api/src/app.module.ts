import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { BikeInformationModule } from './bike-information/bike-information.module';
import { UploadsModule } from './file-upload/file-upload.module';
import { UserActivityService } from './user-activity/user-activity.service';
import { UserActivityModule } from './user-activity/user-activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    UserActivityModule,
    UploadsModule,
    BikeInformationModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserActivityService],
})
export class AppModule {}
