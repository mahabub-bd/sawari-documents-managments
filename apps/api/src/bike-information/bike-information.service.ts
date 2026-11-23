import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserActivityService } from 'src/user-activity/user-activity.service';
import { CreateBikeInformationDto } from './dto/create-bike-information.dto';
import { UpdateBikeInformationDto } from './dto/update-bike-information.dto';
import { BikeInformation } from './schemas/bike-information.schema';

@Injectable()
export class BikeInformationService {
  private readonly logger = new Logger(BikeInformationService.name);

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

      this.logger.log(
        `Bike created: id=${response._id} by user=${createdBy} path=${path}`,
      );

      try {
        await this.userActivityService.logActivity(
          createdBy,
          'Bike Info Created',
          path,
        );
      } catch (logError) {
        // Never fail the create just because activity logging failed
        console.error('Error logging Bike Info Created activity:', logError);
      }

      return {
        message: 'Bike Information created successfully',
        statusCode: HttpStatus.CREATED,
        data: response,
      };
    } catch (error) {
      this.logger.error(
        `Bike create failed for user=${createdBy} path=${path}: ${error instanceof Error ? error.message : error}`,
      );
      try {
        await this.userActivityService.logActivity(
          createdBy,
          'Bike Info Create Failed',
          path,
        );
      } catch {
        // ignore secondary logging failures
      }
      throw new HttpException(
        {
          message: 'Failed to create Bike Information',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Paginated, filterable, sortable listing.
   * All filters are applied in the database; only one page of documents
   * is hydrated and sent over the wire.
   */
  async findAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    brand?: string;
    status?: string;
    year?: string;
    range?: string;
    sort?: string;
  }): Promise<{
    message: string;
    statusCode: number;
    data: BikeInformation[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(query.limit || '10', 10) || 10),
      );

      const filter: Record<string, unknown> = {};

      if (query.search?.trim()) {
        const escaped = query.search
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(escaped, 'i');
        filter.$or = [
          { bikeBrand: rx },
          { engineNumber: rx },
          { chassisNumber: rx },
          { registrationNumber: rx },
          { bikeModel: rx },
          { name: rx },
          { phoneNumber: rx },
        ];
      }

      if (query.brand && query.brand !== 'all') {
        filter.bikeBrand = query.brand;
      }

      if (query.status && query.status !== 'all') {
        filter.registrationStatus = query.status;
      }

      if (query.year) {
        const y = parseInt(query.year, 10);
        if (!Number.isNaN(y)) filter.manufacturingYear = y;
      }

      const range = this.getDateRange(query.range);
      if (range) filter.createdAt = { $gte: range.from, $lte: range.to };

      let sort: Record<string, 1 | -1> = { createdAt: -1 };
      if (query.sort === 'oldest') sort = { createdAt: 1 };
      if (query.sort === 'brand') sort = { bikeBrand: 1, bikeModel: 1 };

      const [bikes, total] = await Promise.all([
        this.bikeInformationModel
          .find(filter)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('createdBy', { _id: 1, name: 1 })
          .populate('updateBy', { _id: 1, name: 1 })
          .populate('regDocument', { _id: 1, filename: 1, mimeType: 1, path: 1 })
          .populate('currentPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
          .populate('sellingVideo', { _id: 1, filename: 1, mimeType: 1, path: 1 })
          .populate('witnessNIDPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
          .populate('sellerNIDPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
          .populate('sellerDLPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
          .lean()
          .exec(),
        this.bikeInformationModel.countDocuments(filter).exec(),
      ]);

      return {
        message: 'Bikes retrieved successfully',
        statusCode: HttpStatus.OK,
        data: bikes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
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

  /**
   * Dashboard aggregates computed in the database, plus the 5 most
   * recent documents. Avoids pulling the whole collection to the client.
   */
  async stats(): Promise<{
    message: string;
    statusCode: number;
    data: {
      total: number;
      registered: number;
      unregistered: number;
      securityPending: number;
      totalPurchaseValue: number;
      addedThisWeek: number;
      addedThisMonth: number;
      recent: BikeInformation[];
      unregisteredList: BikeInformation[];
      securityAging: (BikeInformation & { daysPending: number })[];
    };
  }> {
    try {
      const now = Date.now();
      const DAY = 24 * 60 * 60 * 1000;
      const weekAgo = new Date(now - 7 * DAY);
      const monthAgo = new Date(now - 30 * DAY);

      const [aggregate] = await this.bikeInformationModel
        .aggregate<{
          total: number;
          registered: number;
          securityPending: number;
          totalPurchaseValue: number;
          addedThisWeek: number;
          addedThisMonth: number;
        }>()
        .group({
          _id: null,
          total: { $sum: 1 },
          registered: {
            $sum: {
              $cond: [{ $eq: ['$registrationStatus', 'Registered'] }, 1, 0],
            },
          },
          securityPending: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$securityAmount', 0] },
                    { $ne: ['$securityMoneyReturned', true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalPurchaseValue: { $sum: { $ifNull: ['$purchaseAmount', 0] } },
          addedThisWeek: {
            $sum: { $cond: [{ $gte: ['$createdAt', weekAgo] }, 1, 0] },
          },
          addedThisMonth: {
            $sum: { $cond: [{ $gte: ['$createdAt', monthAgo] }, 1, 0] },
          },
        });

      const recent = await this.bikeInformationModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('createdBy', { _id: 1, name: 1 })
        .populate('currentPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .lean()
        .exec();

      const unregisteredList = await this.bikeInformationModel
        .find({ registrationStatus: { $ne: 'Registered' } })
        .sort({ createdAt: 1 })
        .limit(4)
        .select({ _id: 1, bikeBrand: 1, bikeModel: 1 })
        .lean()
        .exec();

      const agingDocs = await this.bikeInformationModel
        .find({ securityAmount: { $gt: 0 }, securityMoneyReturned: { $ne: true } })
        .sort({ createdAt: 1 })
        .limit(50)
        .populate('createdBy', { _id: 1, name: 1 })
        .populate('currentPhoto', { _id: 1, filename: 1, mimeType: 1, path: 1 })
        .lean()
        .exec();

      const securityAging = agingDocs.map((doc) => ({
        ...doc,
        daysPending: Math.max(
          0,
          Math.floor(
            (now - new Date((doc as unknown as { createdAt: Date }).createdAt).getTime()) /
              DAY,
          ),
        ),
      }));

      const stats = aggregate ?? {
        total: 0,
        registered: 0,
        securityPending: 0,
        totalPurchaseValue: 0,
        addedThisWeek: 0,
        addedThisMonth: 0,
      };

      return {
        message: 'Bike stats retrieved successfully',
        statusCode: HttpStatus.OK,
        data: {
          ...stats,
          unregistered: stats.total - stats.registered,
          recent,
          unregisteredList,
          securityAging,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve bike stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getDateRange(range?: string): { from: Date; to: Date } | null {
    if (!range || range === 'all') return null;

    const now = new Date();
    const startOfDay = (d: Date) => {
      const c = new Date(d);
      c.setHours(0, 0, 0, 0);
      return c;
    };
    const endOfDay = (d: Date) => {
      const c = new Date(d);
      c.setHours(23, 59, 59, 999);
      return c;
    };

    const DAY = 24 * 60 * 60 * 1000;
    const today = startOfDay(now);
    const dayIdx = now.getDay(); // 0 = Sunday

    switch (range) {
      case 'today':
        return { from: today, to: endOfDay(now) };
      case 'thisWeek': {
        const from = new Date(today.getTime() - dayIdx * DAY);
        return { from, to: endOfDay(now) };
      }
      case 'lastWeek': {
        const thisWeekFrom = new Date(today.getTime() - dayIdx * DAY);
        return {
          from: new Date(thisWeekFrom.getTime() - 7 * DAY),
          to: new Date(thisWeekFrom.getTime() - 1),
        };
      }
      case 'thisMonth':
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: endOfDay(now),
        };
      case 'lastMonth':
        return {
          from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          to: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
        };
      case 'thisYear':
        return {
          from: new Date(now.getFullYear(), 0, 1),
          to: endOfDay(now),
        };
      case 'lastYear':
        return {
          from: new Date(now.getFullYear() - 1, 0, 1),
          to: new Date(now.getFullYear(), 0, 0, 23, 59, 59, 999),
        };
      case 'lastSixMonths':
        return { from: new Date(now.getTime() - 182 * DAY), to: endOfDay(now) };
      default:
        return null;
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
        .lean()
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
