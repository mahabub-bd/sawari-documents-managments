import {
  PutObjectCommand, // Command to upload files to S3
  PutObjectCommandInput, // Interface defining the input parameters for PutObjectCommand
  S3Client, // AWS S3 client for interacting with S3
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload } from './schemas/upload.schema'; // Schema for storing file metadata in MongoDB

@Injectable()
export class UploadsService {
  private s3: S3Client; // Instance of the S3 client

  constructor(
    @InjectModel(Upload.name) private readonly uploadsModel: Model<Upload>, // Inject the Upload model for MongoDB interactions
  ) {
    // Initialize S3 client with region and credentials from environment variables
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'ap-southeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Retrieve all files stored in the database.
   *
   * @returns Array of files from MongoDB.
   */
  async getFiles() {
    return await this.uploadsModel.find().exec(); // Fetches all file records from MongoDB
  }

  /**
   * Upload a file to an AWS S3 bucket.
   *
   * @param file - File object from Multer.
   * @returns Object containing the file's location and key in S3.
   *
   * @throws BadRequestException on upload failure.
   */
  async uploadFileToS3(
    file: Express.Multer.File,
  ): Promise<{ Location: string; Key: string }> {
    // Define S3 upload parameters
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || '', // S3 bucket name from environment variables
      Key: `${process.env.BUCKET_FOLDER}/${Date.now()}-${file.originalname}`, // File path in the bucket
      Body: file.buffer, // File content
      ContentType: file.mimetype, // MIME type of the file
    };

    try {
      // Send upload command to S3
      const command = new PutObjectCommand(uploadParams);
      await this.s3.send(command);

      // Construct the public file URL
      const fileUrl = `${process.env.AWS_S3_BASE_URL}/${uploadParams.Key}`;
      return { Location: fileUrl, Key: uploadParams.Key };
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new BadRequestException(
        'Error uploading file to S3',
        error.message,
      ); // Provide user-friendly error response
    }
  }

  /**
   * Validate, upload file to S3, and save metadata in MongoDB.
   *
   * @param file - File object from Multer.
   * @returns The saved metadata as a MongoDB document.
   *
   * @throws BadRequestException if validation fails.
   */
  async saveFileMetadata(file: Express.Multer.File): Promise<Upload> {
    // Define maximum allowed file size (100MB)
    const maxSize = 100 * 1024 * 1024;

    // Ensure a file is provided
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds the 100MB limit.');
    }

    // Validate file MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'video/mp4',
      'vedio/mkv',
      'vedio/avi',
      'vedio/wmv',
      'vedio/mov',
      'vedio/flv',
      'vedio/3gp',
      'vedio/3g2',
      'vedio/ts',
      'vedio/mpeg',
      'vedio/mpg',
      'vedio/m4v',
      'vedio/webm',
      'vedio/ogg',
      'vedio/ogv',
      'vedio/mxf',
      'vedio/mts',
      'vedio/m2ts',
      'vedio/vob',
      'video/quicktime',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }

    // Upload validated file to S3
    const s3UploadResult = await this.uploadFileToS3(file);

    // Create a file metadata object for MongoDB
    const fileMetadata = new this.uploadsModel({
      filename: s3UploadResult.Key, // S3 key
      originalname: file.originalname, // Original file name
      size: file.size, // File size in bytes
      mimeType: file.mimetype, // MIME type
      path: s3UploadResult.Location, // S3 file URL
    });

    // Save file metadata to MongoDB
    return await fileMetadata.save();
  }
}
