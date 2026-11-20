import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserActivityService } from 'src/user-activity/user-activity.service';
import { CreateBikeInformationDto } from './dto/create-bike-information.dto';
import { UpdateBikeInformationDto } from './dto/update-bike-information.dto';
import { BikeInformation } from './schemas/bike-information.schema';

@Injectable()
export class BikeInformationService {
  constructor(
    @InjectModel(BikeInformation.name)
    private readonly bikeInformationModel: Model<BikeInformation>,
    private readonly userActivityService: UserActivityService,
  ) {}

  async create(
    createBikeInformationDto: CreateBikeInformationDto,
    createdBy: string,
    path: string,
  ): Promise<{
    message: string;
    statusCode: number;
    data: BikeInformation | null;
  }> {
    try {
      const data = {
        ...createBikeInformationDto,
        createdBy,
      };
      const response = await this.bikeInformationModel.create(data);

      await this.userActivityService.logActivity(
        createdBy,
        'Bike Info Created',
        path,
      );

      return {
        message: 'Bike Information created successfully',
        statusCode: HttpStatus.CREATED,
        data: response,
      };
    } catch (error) {
      console.error('Error creating Bike Information:', error);
      throw new HttpException(
        {
          message: 'Failed to create Bike Information',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<{
    message: string;
    statusCode: number;
    data: BikeInformation[];
  }> {
    try {
      const bikes = await this.bikeInformationModel
        .find({})
        .sort({ createdAt: -1 })
        .populate('createdBy', { _id: 1, name: 1 })
        .populate('updateBy', { _id: 1, name: 1 })
        .populate('regDocument', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .populate('currentPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .populate('sellingVideo', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .populate('witnessNIDPhoto', {
          _id: 1,
          filename: 1,
          mimeType: 1,
          path: 1,
        })
        .populate('sellerNIDPhoto', {
          _id: 1,
          filename: 1,
          mimeType: 1,
          path: 1,
        })
        .populate('sellerDLPhoto', {
          _id: 1,
          filename: 1,
          mimeType: 1,
          path: 1,
        })
        .exec();
      return {
        message: 'Bikes retrieved successfully',
        statusCode: HttpStatus.OK,
        data: bikes,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to retrieve bikes',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<BikeInformation> {
    try {
      const bike = await this.bikeInformationModel
        .findById(id)
        .populate('createdBy', { _id: 1, name: 1 })
        .populate('updateBy', { _id: 1, name: 1 })
        .populate('regDocument', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .populate('currentPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .populate('sellingVideo', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .populate('witnessNIDPhoto', {
          _id: 1,
          filename: 1,
          mimeType: 1,
          path: 1,
        })
        .populate('sellerNIDPhoto', {
          _id: 1,
          filename: 1,
          mimeType: 1,
          path: 1,
        })
        .populate('sellerDLPhoto', {
          _id: 1,
          filename: 1,
          mimeType: 1,
          path: 1,
        })
        .exec();
      if (!bike) {
        throw new HttpException('Bike not found', HttpStatus.NOT_FOUND);
      }
      return bike;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve bike',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateBikeInformationDto: UpdateBikeInformationDto,
    updatedBy: string,
    path: string,
  ): Promise<{
    message: string;
    statusCode: number;
    data: BikeInformation | null;
  }> {
    try {
      const bike = await this.bikeInformationModel.findById(id).exec();

      if (!bike) {
        throw new HttpException('Bike not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(bike, {
        ...updateBikeInformationDto,
        updateBy: updatedBy,
        updatedAt: new Date(),
      });

      const updatedBike = await bike.save();

      await this.userActivityService.logActivity(
        updatedBy,
        'Bike Info Updated',
        path,
      );

      return {
        message: 'Bike Information updated successfully',
        statusCode: HttpStatus.OK,
        data: updatedBike,
      };
    } catch (error) {
      console.error('Error updating Bike Information:', error);
      throw new HttpException(
        'Failed to update Bike Information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(
    id: string,
    deletedBy: string,
    path: string,
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    try {
      const deletedBike = await this.bikeInformationModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedBike) {
        throw new HttpException('Bike not found', HttpStatus.NOT_FOUND);
      }

      await this.userActivityService.logActivity(
        deletedBy,
        'Bike Info Deleted',
        path,
      );

      return {
        message: 'Bike Information deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to delete Bike Information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
