import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully signed up.' })
  @ApiResponse({ status: 400, description: 'Invalid user data.' })
  signup(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const path = req.path;
    return this.authService.signUp(createUserDto, path);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in.' })
  @ApiResponse({ status: 400, description: 'Invalid login credentials.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  signin(@Body() data: AuthDto, @Req() req: Request) {
    const path = req.path;
    return this.authService.signIn(data, path);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  @ApiOperation({ summary: 'Log out the current user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  signout(@Req() req: Request) {
    const userId = req.user['sub'];
    const path = req.path;
    return this.authService.signout(userId, path);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid refresh token.',
  })
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const path = req.path;
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken, path);
  }
}
