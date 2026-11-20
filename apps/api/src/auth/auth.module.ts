import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserActivityModule } from 'src/user-activity/user-activity.module';
import { UserActivityService } from 'src/user-activity/user-activity.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule, UserActivityModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UserActivityService,
  ],
})
export class AuthModule {}
