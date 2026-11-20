import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserActivityService } from './user-activity.service';

@ApiTags('User Activity')
@Controller('user-activity')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Fetch all activity logs for a specific user' })
  async getActivities(@Param('userId') userId: string) {
    const data = await this.userActivityService.getActivities(userId);
    return {
      message: 'User activity logs retrieved successfully.',
      statusCode: 200,
      data,
    };
  }

  @Get(':userId/recent')
  @ApiOperation({ summary: 'Fetch recent activity logs for a specific user' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of recent logs to fetch',
    required: false,
  })
  async getRecentActivities(
    @Param('userId') userId: string,
    @Query('limit') limit,
  ) {
    const data = await this.userActivityService.getRecentActivities(
      userId,
      limit,
    );
    return {
      message: 'Recent user activity logs retrieved successfully.',
      statusCode: 200,
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all activity logs across all users' })
  async getAllActivities(@Query('page') page = 1, @Query('limit') limit = 10) {
    const { data, total, totalPages } =
      await this.userActivityService.getAllActivities(page, limit);
    return {
      message: 'All user activity logs retrieved successfully.',
      statusCode: 200,
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
