import {
  BadRequestException, // Custom exception to handle bad requests
  Controller,
  Get, // Used to define an HTTP GET endpoint
  Post, // Used to define an HTTP POST endpoint
  UploadedFile, // Decorator to access the uploaded file in the request
  UseInterceptors, // Middleware to transform or intercept the request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Middleware to handle file uploads
import { ApiOperation, ApiResponse, ApiTags,  ApiConsumes, } from '@nestjs/swagger';
import { UploadsService } from './file-upload.service'; // Service layer for managing uploads

@ApiTags('Uploads')
@Controller('uploads') // Define the controller base route as /uploads
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Retrieve a list of uploaded files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async getFiles() {
    return this.uploadsService.getFiles();
  }

  /**
   * @Post('/')
   * Endpoint to handle file uploads.
   * Uses FileInterceptor to handle the file from the request.
   *
   * Validations:
   * - Throws BadRequestException if no file is provided in the request.
   *
   * - Request Body: Form data containing the file with a key of 'file'.
   * - Returns: Success message and saved file metadata.
   */
  @Post('/')
  @ApiOperation({ summary: 'Upload a file' })
    @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file provided' })
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  // Middleware to extract the uploaded file from the form data
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Validation: Check if a file is provided
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    // Save file metadata using UploadsService
    const fileData = await this.uploadsService.saveFileMetadata(file);

    // Return response indicating success with saved metadata
    return {
      message: 'File uploaded successfully',
      fileData,
    };
  }
}
