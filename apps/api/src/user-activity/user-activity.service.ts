import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserActivity } from './schemas/user-activity.schema';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectModel(UserActivity.name)
    private readonly userActivityModel: Model<UserActivity>,
  ) {}

  /**
   * Logs an activity for a user.
   * @param userId - ID of the user performing the action.
   * @param action - Action being performed by the user.
   * @returns The newly logged activity document.
   */
  async logActivity(
    userId: string,
    action: string,
    path: string,
  ): Promise<UserActivity> {
    const newActivity = new this.userActivityModel({ userId, action, path });
    return newActivity.save();
  }

  /**
   * Fetches all activities of a specific user.
   * @param userId - ID of the user whose activities need to be retrieved.
   * @returns An array of user activity documents.
   */
  async getActivities(userId: string): Promise<UserActivity[]> {
    return this.userActivityModel
      .find({ userId })
      .populate('userId', { _id: 1, name: 1, email: 1, role: 1 }) // Populate user info
      .sort({ createdAt: -1 }) // Order by most recent first
      .exec();
  }

  /**
   * Fetches recent activities (e.g., latest `limit`) for a user.
   * @param userId - ID of the user.
   * @param limit - Number of records to retrieve (default: 5).
   * @returns Array of user activity documents.
   */
  async getRecentActivities(
    userId: string,
    limit = 10,
  ): Promise<UserActivity[]> {
    return this.userActivityModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Fetches all activities across all users.
   * @returns An array of all user activity documents.
   */
  async getAllActivities(
    page: number,
    limit: number,
  ): Promise<{ data: UserActivity[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const data = await this.userActivityModel
      .find()
      .populate('userId', { _id: 1, name: 1, role: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.userActivityModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }
}
