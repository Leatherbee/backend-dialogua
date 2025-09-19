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
import { Public } from '../auth/decorators/public.decorator';
import { ContentItemService } from './content-item.service';
import { CreateContentItemDto, UpdateContentItemDto } from './dto';
import { ContentType } from '../../common/enums';

@ApiTags('Content Items')
@Controller('content-items')
export class ContentItemController {
  constructor(private readonly contentItemService: ContentItemService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new content item',
    description:
      'Creates a new content item (quiz, roleplay, or form) within a specific unit level with positioning and metadata',
  })
  @ApiBody({
    description: 'Content item creation data',
    type: CreateContentItemDto,
    schema: {
      type: 'object',
      properties: {
        content_type: {
          type: 'string',
          enum: ['form', 'roleplay'],
          description: 'Type of content item',
          example: 'roleplay',
        },
        title: {
          type: 'string',
          maxLength: 255,
          description: 'Content item title',
          example: 'Restaurant Ordering Roleplay',
        },
        description: {
          type: 'string',
          description: 'Content item description',
          example: 'Practice ordering food at a restaurant',
          nullable: true,
        },
        content: {
          type: 'string',
          description: 'Main content or instructions',
          example: 'You are at a restaurant. Order your favorite meal.',
          nullable: true,
        },
        position: {
          type: 'integer',
          minimum: 0,
          description: 'Position within the unit level',
          example: 1,
        },
        unit_level_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the unit level this content belongs to',
          example: 1,
        },
        media_asset_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of associated media asset',
          example: 1,
          nullable: true,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the content item',
          example: { difficulty: 'beginner', duration: 300 },
          nullable: true,
        },
      },
      required: ['content_type', 'title', 'position', 'unit_level_id'],
    },
    examples: {
      roleplay: {
        summary: 'Roleplay content item',
        value: {
          content_type: 'roleplay',
          title: 'Restaurant Ordering',
          description: 'Practice ordering food at a restaurant',
          content: 'You are at a restaurant. Order your favorite meal.',
          position: 1,
          unit_level_id: 1,
          metadata: { difficulty: 'beginner', duration: 300 },
        },
      },
      form: {
        summary: 'Form content item',
        value: {
          content_type: 'form',
          title: 'Personal Information Form',
          description: 'Fill out personal details',
          position: 2,
          unit_level_id: 1,
          media_asset_id: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Content item created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        content_type: {
          type: 'string',
          enum: ['form', 'roleplay'],
          example: 'roleplay',
        },
        title: { type: 'string', example: 'Restaurant Ordering Roleplay' },
        description: {
          type: 'string',
          example: 'Practice ordering food at a restaurant',
        },
        content: {
          type: 'string',
          example: 'You are at a restaurant. Order your favorite meal.',
        },
        position: { type: 'integer', example: 1 },
        unit_level_id: { type: 'integer', example: 1 },
        media_asset_id: { type: 'integer', example: 1, nullable: true },
        metadata: {
          type: 'object',
          example: { difficulty: 'beginner', duration: 300 },
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
        unitLevel: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Beginner Level' },
            position: { type: 'integer', example: 1 },
          },
        },
        mediaAsset: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'integer', example: 1 },
            media_type: { type: 'string', example: 'image' },
            url: { type: 'string', example: 'https://example.com/image.jpg' },
          },
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
    description: 'Internal server error during content item creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createContentItemDto: CreateContentItemDto) {
    return this.contentItemService.create(createContentItemDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all content items or filter by unit level or type',
    description:
      'Retrieves all content items in the system or filters by unit level ID or content type. Items are ordered by position',
  })
  @ApiQuery({
    name: 'unitLevelId',
    required: false,
    type: 'integer',
    description: 'Filter content items by unit level ID',
    example: 1,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['form', 'roleplay'],
    description: 'Filter content items by content type',
    example: 'roleplay',
  })
  @ApiResponse({
    status: 200,
    description: 'Content items retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          content_type: {
            type: 'string',
            enum: ['form', 'roleplay'],
            example: 'roleplay',
          },
          title: { type: 'string', example: 'Restaurant Ordering Roleplay' },
          description: {
            type: 'string',
            example: 'Practice ordering food at a restaurant',
          },
          content: {
            type: 'string',
            example: 'You are at a restaurant. Order your favorite meal.',
          },
          position: { type: 'integer', example: 1 },
          unit_level_id: { type: 'integer', example: 1 },
          media_asset_id: { type: 'integer', example: 1, nullable: true },
          metadata: {
            type: 'object',
            example: { difficulty: 'beginner', duration: 300 },
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
          unitLevel: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Beginner Level' },
              position: { type: 'integer', example: 1 },
            },
          },
          mediaAsset: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'integer', example: 1 },
              media_type: { type: 'string', example: 'image' },
              url: { type: 'string', example: 'https://example.com/image.jpg' },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during content items retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll(
    @Query('unitLevelId', ParseIntPipe) unitLevelId?: number,
    @Query('type') type?: ContentType,
  ) {
    if (unitLevelId) {
      return this.contentItemService.findByUnitLevel(unitLevelId);
    }
    if (type) {
      return this.contentItemService.findByType(type);
    }
    return this.contentItemService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get content item by ID',
    description:
      'Retrieves a specific content item by its ID with related unit level and media asset information',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Content item ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Content item retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        content_type: {
          type: 'string',
          enum: ['form', 'roleplay'],
          example: 'roleplay',
        },
        title: { type: 'string', example: 'Restaurant Ordering Roleplay' },
        description: {
          type: 'string',
          example: 'Practice ordering food at a restaurant',
        },
        content: {
          type: 'string',
          example: 'You are at a restaurant. Order your favorite meal.',
        },
        position: { type: 'integer', example: 1 },
        unit_level_id: { type: 'integer', example: 1 },
        media_asset_id: { type: 'integer', example: 1, nullable: true },
        metadata: {
          type: 'object',
          example: { difficulty: 'beginner', duration: 300 },
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
        unitLevel: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Beginner Level' },
            position: { type: 'integer', example: 1 },
          },
        },
        mediaAsset: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'integer', example: 1 },
            media_type: { type: 'string', example: 'image' },
            url: { type: 'string', example: 'https://example.com/image.jpg' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid content item ID parameter',
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
    description: 'Content item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ContentItem with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update content item',
    description:
      'Updates an existing content item with new information. All fields are optional',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Content item ID to update',
    example: 1,
  })
  @ApiBody({
    description: 'Content item update data (all fields optional)',
    type: UpdateContentItemDto,
    schema: {
      type: 'object',
      properties: {
        content_type: {
          type: 'string',
          enum: ['form', 'roleplay'],
          description: 'Type of content item',
          example: 'roleplay',
        },
        title: {
          type: 'string',
          maxLength: 255,
          description: 'Content item title',
          example: 'Restaurant Ordering Roleplay - Updated',
        },
        description: {
          type: 'string',
          description: 'Content item description',
          example: 'Updated description for restaurant ordering practice',
          nullable: true,
        },
        content: {
          type: 'string',
          description: 'Main content or instructions',
          example: 'You are at a fancy restaurant. Order a three-course meal.',
          nullable: true,
        },
        position: {
          type: 'integer',
          minimum: 0,
          description: 'Position within the unit level',
          example: 2,
        },
        unit_level_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the unit level this content belongs to',
          example: 1,
        },
        media_asset_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of associated media asset',
          example: 2,
          nullable: true,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the content item',
          example: { difficulty: 'intermediate', duration: 450 },
          nullable: true,
        },
      },
    },
    examples: {
      titleOnly: {
        summary: 'Update title only',
        value: {
          title: 'Advanced Restaurant Ordering',
        },
      },
      multipleFields: {
        summary: 'Update multiple fields',
        value: {
          title: 'Advanced Restaurant Ordering',
          description: 'Practice ordering at a fine dining restaurant',
          position: 2,
          metadata: { difficulty: 'intermediate', duration: 450 },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Content item updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        content_type: {
          type: 'string',
          enum: ['form', 'roleplay'],
          example: 'roleplay',
        },
        title: {
          type: 'string',
          example: 'Restaurant Ordering Roleplay - Updated',
        },
        description: {
          type: 'string',
          example: 'Updated description for restaurant ordering practice',
        },
        content: {
          type: 'string',
          example: 'You are at a fancy restaurant. Order a three-course meal.',
        },
        position: { type: 'integer', example: 2 },
        unit_level_id: { type: 'integer', example: 1 },
        media_asset_id: { type: 'integer', example: 2, nullable: true },
        metadata: {
          type: 'object',
          example: { difficulty: 'intermediate', duration: 450 },
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
        unitLevel: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Beginner Level' },
            position: { type: 'integer', example: 1 },
          },
        },
        mediaAsset: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'integer', example: 2 },
            media_type: { type: 'string', example: 'video' },
            url: { type: 'string', example: 'https://example.com/video.mp4' },
          },
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
    description: 'Content item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ContentItem with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentItemDto: UpdateContentItemDto,
  ) {
    return this.contentItemService.update(id, updateContentItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete content item',
    description:
      'Soft deletes a content item by setting the deletedAt timestamp. The content item will no longer appear in normal queries',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Content item ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Content item deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Content item deleted successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid content item ID parameter',
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
    description: 'Content item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'ContentItem with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during content item deletion',
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
    return this.contentItemService.remove(id);
  }
}
