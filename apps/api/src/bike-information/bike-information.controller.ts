import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { BikeInformationService } from './bike-information.service';
import { CreateBikeInformationDto } from './dto/create-bike-information.dto';
import { UpdateBikeInformationDto } from './dto/update-bike-information.dto';

@ApiTags('Bike Information')
@Controller('bike-information')
export class BikeInformationController {
  constructor(
    private readonly bikeInformationService: BikeInformationService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products with pagination and sorting',
    description:
      'Retrieve a paginated list of products with sorting capabilities. Default sorting is by createdAt in descending order.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    type: String,
    description:
      'Field to sort by (default: createdAt). Available fields: createdAt, updatedAt, name, sellingPrice',
    enum: ['createdAt', 'updatedAt', 'name', 'sellingPrice'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order (default: dsc)',
    enum: ['asc', 'dsc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved products',
    schema: {
      example: {
        message: 'Products retrieved successfully',
        statusCode: 200,
        data: {
          products: [
            {
              id: 1,
              name: 'Sample Product',
              // ... other product fields
            },
          ],
          total: 25,
          page: '1',
          limit: '10',
          totalPages: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Failed to retrieve products',
        statusCode: 500,
        data: {
          products: [],
          total: 0,
          page: '0',
          limit: '0',
          totalPages: 0,
        },
      },
    },
  })
  async findAll() {
    return this.bikeInformationService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new bike information entry' })
  @ApiResponse({
    status: 201,
    description: 'Bike information created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createBikeInformationDto: CreateBikeInformationDto,
    @Req() req: Request,
  ) {
    return this.bikeInformationService.create(
      createBikeInformationDto,
      req.user['sub'],
      req.path,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bike information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Bike information retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Bike information not found.' })
  findOne(@Param('id') id: string) {
    return this.bikeInformationService.findOne(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update bike information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Bike information updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid update data.' })
  @ApiResponse({ status: 404, description: 'Bike information not found.' })
  update(
    @Param('id') id: string,
    @Body() updateBikeInformationDto: UpdateBikeInformationDto,
    @Req() req: Request,
  ) {
    return this.bikeInformationService.update(
      id,
      updateBikeInformationDto,
      req.user['sub'],
      req.path,
    );
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete bike information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Bike information deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Bike information not found.' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.bikeInformationService.remove(id, req.user['sub'], req.path);
  }
}
