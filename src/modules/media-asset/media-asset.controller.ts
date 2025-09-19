import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { MediaAssetService } from './media-asset.service';
import { CreateMediaAssetDto, UpdateMediaAssetDto } from './dto';
import { MediaType } from '../../common/enums';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Media Assets')
@Controller('media-assets')
export class MediaAssetController {
  constructor(private readonly mediaAssetService: MediaAssetService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new media asset',
    description:
      'Creates a new media asset (image, video, audio, or document) with URL and optional metadata',
  })
  @ApiBody({
    description: 'Media asset creation data',
    type: CreateMediaAssetDto,
    schema: {
      type: 'object',
      properties: {
        media_type: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'document'],
          description: 'Type of media asset',
          example: 'image',
        },
        url: {
          type: 'string',
          format: 'uri',
          maxLength: 500,
          description: 'URL of the media asset',
          example: 'https://example.com/images/lesson1.jpg',
        },
        duration_sec: {
          type: 'number',
          minimum: 0,
          description: 'Duration in seconds (for audio/video)',
          example: 120,
          nullable: true,
        },
        transcript: {
          type: 'string',
          description: 'Text transcript (for audio/video)',
          example: 'Hello, welcome to our Indonesian language lesson.',
          nullable: true,
        },
        alt_text: {
          type: 'string',
          maxLength: 255,
          description: 'Alternative text description (for images)',
          example: 'A photo of traditional Indonesian food',
          nullable: true,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the media asset',
          example: { resolution: '1920x1080', format: 'jpeg' },
          nullable: true,
        },
      },
      required: ['media_type', 'url'],
    },
    examples: {
      image: {
        summary: 'Image media asset',
        value: {
          media_type: 'image',
          url: 'https://example.com/images/lesson1.jpg',
          alt_text: 'Indonesian traditional food',
          metadata: { resolution: '1920x1080', format: 'jpeg' },
        },
      },
      video: {
        summary: 'Video media asset',
        value: {
          media_type: 'video',
          url: 'https://example.com/videos/lesson1.mp4',
          duration_sec: 300,
          transcript: 'Welcome to Indonesian language learning...',
          metadata: { resolution: '1920x1080', format: 'mp4' },
        },
      },
      audio: {
        summary: 'Audio media asset',
        value: {
          media_type: 'audio',
          url: 'https://example.com/audio/pronunciation.mp3',
          duration_sec: 45,
          transcript: 'Selamat pagi means good morning',
          metadata: { bitrate: '128kbps', format: 'mp3' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media asset created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        media_type: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'document'],
          example: 'image',
        },
        url: {
          type: 'string',
          example: 'https://example.com/images/lesson1.jpg',
        },
        duration_sec: { type: 'number', example: 120, nullable: true },
        transcript: {
          type: 'string',
          example: 'Hello, welcome to our lesson.',
          nullable: true,
        },
        alt_text: {
          type: 'string',
          example: 'Indonesian traditional food',
          nullable: true,
        },
        metadata: {
          type: 'object',
          example: { resolution: '1920x1080', format: 'jpeg' },
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during media asset creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createMediaAssetDto: CreateMediaAssetDto) {
    return this.mediaAssetService.create(createMediaAssetDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all media assets',
    description:
      'Retrieves all media assets with optional filtering by media type',
  })
  @ApiQuery({
    name: 'type',
    enum: MediaType,
    required: false,
    description: 'Filter by media type',
    example: 'image',
  })
  @ApiResponse({
    status: 200,
    description: 'Media assets retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          media_type: {
            type: 'string',
            enum: ['image', 'video', 'audio', 'document'],
            example: 'image',
          },
          url: {
            type: 'string',
            example: 'https://example.com/images/lesson1.jpg',
          },
          duration_sec: { type: 'number', example: 120, nullable: true },
          transcript: {
            type: 'string',
            example: 'Hello, welcome to our lesson.',
            nullable: true,
          },
          alt_text: {
            type: 'string',
            example: 'Indonesian traditional food',
            nullable: true,
          },
          metadata: {
            type: 'object',
            example: { resolution: '1920x1080', format: 'jpeg' },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: null,
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during media assets retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(@Query('type') type?: MediaType) {
    if (type) {
      return this.mediaAssetService.findByType(type);
    }
    return this.mediaAssetService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get media asset by ID',
    description: 'Retrieves a specific media asset by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Media asset ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Media asset retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        media_type: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'document'],
          example: 'image',
        },
        url: {
          type: 'string',
          example: 'https://example.com/images/lesson1.jpg',
        },
        duration_sec: { type: 'number', example: 120, nullable: true },
        transcript: {
          type: 'string',
          example: 'Hello, welcome to our lesson.',
          nullable: true,
        },
        alt_text: {
          type: 'string',
          example: 'Indonesian traditional food',
          nullable: true,
        },
        metadata: {
          type: 'object',
          example: { resolution: '1920x1080', format: 'jpeg' },
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid media asset ID parameter',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Media asset not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'MediaAsset with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during media asset retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaAssetService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update media asset',
    description:
      'Updates a media asset with new information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Media asset ID',
    example: 1,
  })
  @ApiBody({
    description: 'Media asset update data',
    type: UpdateMediaAssetDto,
    schema: {
      type: 'object',
      properties: {
        media_type: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'document'],
          description: 'Type of media asset',
          example: 'video',
        },
        url: {
          type: 'string',
          format: 'uri',
          maxLength: 500,
          description: 'URL of the media asset',
          example: 'https://example.com/videos/updated-lesson.mp4',
        },
        duration_sec: {
          type: 'number',
          minimum: 0,
          description: 'Duration in seconds (for audio/video)',
          example: 180,
          nullable: true,
        },
        transcript: {
          type: 'string',
          description: 'Text transcript (for audio/video)',
          example: 'Updated transcript content...',
          nullable: true,
        },
        alt_text: {
          type: 'string',
          maxLength: 255,
          description: 'Alternative text description (for images)',
          example: 'Updated alt text description',
          nullable: true,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the media asset',
          example: { resolution: '4K', format: 'mp4', updated: true },
          nullable: true,
        },
      },
    },
    examples: {
      urlOnly: {
        summary: 'Update URL only',
        value: {
          url: 'https://example.com/videos/new-lesson.mp4',
        },
      },
      multipleFields: {
        summary: 'Update multiple fields',
        value: {
          url: 'https://example.com/videos/updated-lesson.mp4',
          duration_sec: 240,
          transcript: 'Updated lesson content with new information...',
          metadata: { resolution: '4K', format: 'mp4', version: 2 },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Media asset updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        media_type: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'document'],
          example: 'video',
        },
        url: {
          type: 'string',
          example: 'https://example.com/videos/updated-lesson.mp4',
        },
        duration_sec: { type: 'number', example: 240, nullable: true },
        transcript: {
          type: 'string',
          example: 'Updated lesson content...',
          nullable: true,
        },
        alt_text: {
          type: 'string',
          example: 'Updated description',
          nullable: true,
        },
        metadata: {
          type: 'object',
          example: { resolution: '4K', format: 'mp4', version: 2 },
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T11:45:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          example: null,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or ID parameter',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Media asset not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'MediaAsset with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during media asset update',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaAssetDto: UpdateMediaAssetDto,
  ) {
    return this.mediaAssetService.update(id, updateMediaAssetDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete media asset',
    description:
      'Soft deletes a media asset by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Media asset ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Media asset deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        media_type: {
          type: 'string',
          enum: ['image', 'video', 'audio', 'document'],
          example: 'image',
        },
        url: {
          type: 'string',
          example: 'https://example.com/images/lesson1.jpg',
        },
        duration_sec: { type: 'number', example: 120, nullable: true },
        transcript: {
          type: 'string',
          example: 'Hello, welcome to our lesson.',
          nullable: true,
        },
        alt_text: {
          type: 'string',
          example: 'Indonesian traditional food',
          nullable: true,
        },
        metadata: {
          type: 'object',
          example: { resolution: '1920x1080', format: 'jpeg' },
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T12:00:00.000Z',
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T12:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid media asset ID parameter',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation failed (numeric string is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Media asset not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'MediaAsset with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during media asset deletion',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediaAssetService.remove(id);
  }
}
