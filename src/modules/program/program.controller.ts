import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ProgramService } from './program.service';
import { CreateProgramDto, UpdateProgramDto } from './dto';

@ApiTags('Programs')
@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new program',
    description:
      'Creates a new learning program (e.g., BIPA 1, BIPA 2) with title, description, and optional metadata',
  })
  @ApiBody({
    type: CreateProgramDto,
    description: 'Program creation data',
    examples: {
      example1: {
        summary: 'BIPA Program Example',
        value: {
          title: 'BIPA Level 1',
          description: 'Beginner Indonesian language program for new learners',
          image_url: 'https://example.com/bipa1-banner.jpg',
          order_index: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Program successfully created',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        title: {
          type: 'string',
          example: 'BIPA Level 1',
        },
        description: {
          type: 'string',
          example: 'Beginner Indonesian language program for new learners',
        },
        image_url: {
          type: 'string',
          example: 'https://example.com/bipa1-banner.jpg',
        },
        order_index: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programService.create(createProgramDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all programs',
    description:
      'Retrieves a list of all learning programs ordered by their index',
  })
  @ApiResponse({
    status: 200,
    description: 'List of programs successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'BIPA Level 1' },
          description: {
            type: 'string',
            example: 'Beginner Indonesian language program',
          },
          image_url: {
            type: 'string',
            example: 'https://example.com/banner.jpg',
          },
          order_index: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          units: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                description: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.programService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get program by ID',
    description: 'Retrieves a specific program by its UUID with related units',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the program',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Program successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string', example: 'BIPA Level 1' },
        description: {
          type: 'string',
          example: 'Beginner Indonesian language program',
        },
        image_url: {
          type: 'string',
          example: 'https://example.com/banner.jpg',
        },
        order_index: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        units: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              description: { type: 'string' },
              order_index: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Program not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Program with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid UUID format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.programService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update program',
    description:
      'Updates an existing program with the provided information (partial update)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the program to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateProgramDto,
    description: 'Program update data (partial)',
    examples: {
      example1: {
        summary: 'Update title and description',
        value: {
          title: 'BIPA Level 1 - Updated',
          description:
            'Updated description for beginner Indonesian language program',
        },
      },
      example2: {
        summary: 'Update order index',
        value: {
          order_index: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Program successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string', example: 'BIPA Level 1 - Updated' },
        description: {
          type: 'string',
          example:
            'Updated description for beginner Indonesian language program',
        },
        image_url: {
          type: 'string',
          example: 'https://example.com/banner.jpg',
        },
        order_index: { type: 'number', example: 2 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Program not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Program with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or UUID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programService.update(id, updateProgramDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete program',
    description:
      'Soft deletes a program by its UUID (program is marked as deleted but not permanently removed)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the program to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Program successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Program deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Program not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Program with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid UUID format' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.programService.remove(id);
  }
}
