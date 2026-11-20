import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserActivityService } from 'src/user-activity/user-activity.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userActivityService: UserActivityService,
  ) {}

  async signUp(createUserDto: CreateUserDto, path: string) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const newUser = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    await this.userActivityService.logActivity(newUser.id, 'Sign Up', path);

    return {
      statusCode: 201,
      message: 'User successfully registered',
      tokens,
    };
  }

  async signIn(data: AuthDto, path: string) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) throw new BadRequestException('Invalid Credentials');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.userActivityService.logActivity(user.id, 'Sign In', path);

    return {
      statusCode: 201,
      message: 'User successfully logged in',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  async signout(userId: string, path: string) {
    await this.usersService.update(
      userId,
      { refreshToken: null },
      userId,
      path,
    );
    await this.userActivityService.logActivity(userId, 'Sign Out', path);

    return {
      statusCode: 200,
      message: 'User successfully logged out',
    };
  }

  async refreshTokens(userId: string, refreshToken: string, path: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.userActivityService.logActivity(user.id, 'Token Refresh', path);

    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(
      userId,
      { refreshToken: hashedRefreshToken },
      userId,
      '/auth/refresh-token',
    );
  }

  async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') as any,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
