import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { FormFieldService } from './form-field.service';
import { CreateFormFieldDto, UpdateFormFieldDto } from './dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Form Fields')
@Controller('form-fields')
export class FormFieldController {
  constructor(private readonly formFieldService: FormFieldService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new form field',
    description:
      'Creates a new form field with validation rules and metadata for a specific form question',
  })
  @ApiBody({
    description: 'Form field creation data',
    type: CreateFormFieldDto,
    schema: {
      type: 'object',
      properties: {
        field_name: {
          type: 'string',
          maxLength: 255,
          description: 'Name of the form field',
          example: 'email_address',
        },
        field_type: {
          type: 'string',
          maxLength: 50,
          description: 'Type of the form field (text, email, number, etc.)',
          example: 'email',
        },
        placeholder: {
          type: 'string',
          maxLength: 255,
          description: 'Placeholder text for the form field',
          example: 'Enter your email address',
          nullable: true,
        },
        is_required: {
          type: 'boolean',
          description: 'Whether the field is required',
          example: true,
          nullable: true,
        },
        validation_rules: {
          type: 'object',
          description: 'Validation rules for the form field',
          example: {
            minLength: 5,
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          },
          nullable: true,
        },
        form_question_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the form question this field belongs to',
          example: 1,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the form field',
          example: { autocomplete: 'email', inputmode: 'email' },
          nullable: true,
        },
      },
      required: ['field_name', 'field_type', 'form_question_id'],
    },
    examples: {
      emailField: {
        summary: 'Email form field',
        value: {
          field_name: 'email_address',
          field_type: 'email',
          placeholder: 'Enter your email address',
          is_required: true,
          validation_rules: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          },
          form_question_id: 1,
          metadata: { autocomplete: 'email', inputmode: 'email' },
        },
      },
      textField: {
        summary: 'Text form field',
        value: {
          field_name: 'full_name',
          field_type: 'text',
          placeholder: 'Enter your full name',
          is_required: true,
          validation_rules: { minLength: 2, maxLength: 100 },
          form_question_id: 2,
          metadata: { autocomplete: 'name' },
        },
      },
      numberField: {
        summary: 'Number form field',
        value: {
          field_name: 'age',
          field_type: 'number',
          placeholder: 'Enter your age',
          is_required: false,
          validation_rules: { min: 18, max: 120 },
          form_question_id: 3,
          metadata: { inputmode: 'numeric' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Form field created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        field_name: { type: 'string', example: 'email_address' },
        field_type: { type: 'string', example: 'email' },
        placeholder: {
          type: 'string',
          example: 'Enter your email address',
          nullable: true,
        },
        is_required: { type: 'boolean', example: true, nullable: true },
        validation_rules: {
          type: 'object',
          example: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          },
          nullable: true,
        },
        form_question_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { autocomplete: 'email', inputmode: 'email' },
          nullable: true,
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
    description: 'Internal server error during form field creation',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  create(@Body() createFormFieldDto: CreateFormFieldDto) {
    return this.formFieldService.create(createFormFieldDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all form fields',
    description: 'Retrieves all form fields in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Form fields retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          field_name: { type: 'string', example: 'email_address' },
          field_type: { type: 'string', example: 'email' },
          placeholder: {
            type: 'string',
            example: 'Enter your email address',
            nullable: true,
          },
          is_required: { type: 'boolean', example: true, nullable: true },
          validation_rules: {
            type: 'object',
            example: {
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            },
            nullable: true,
          },
          form_question_id: { type: 'integer', example: 1 },
          metadata: {
            type: 'object',
            example: { autocomplete: 'email', inputmode: 'email' },
            nullable: true,
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
    description: 'Internal server error during form fields retrieval',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  findAll() {
    return this.formFieldService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get form field by ID',
    description: 'Retrieves a specific form field by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Form field ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Form field retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        field_name: { type: 'string', example: 'email_address' },
        field_type: { type: 'string', example: 'email' },
        placeholder: {
          type: 'string',
          example: 'Enter your email address',
          nullable: true,
        },
        is_required: { type: 'boolean', example: true, nullable: true },
        validation_rules: {
          type: 'object',
          example: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          },
          nullable: true,
        },
        form_question_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { autocomplete: 'email', inputmode: 'email' },
          nullable: true,
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
    description: 'Invalid form field ID parameter',
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
    description: 'Form field not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'FormField with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during form field retrieval',
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
    return this.formFieldService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update form field',
    description:
      'Updates a form field with new information. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Form field ID',
    example: 1,
  })
  @ApiBody({
    description: 'Form field update data',
    type: UpdateFormFieldDto,
    schema: {
      type: 'object',
      properties: {
        field_name: {
          type: 'string',
          maxLength: 255,
          description: 'Name of the form field',
          example: 'updated_email_address',
        },
        field_type: {
          type: 'string',
          maxLength: 50,
          description: 'Type of the form field',
          example: 'email',
        },
        placeholder: {
          type: 'string',
          maxLength: 255,
          description: 'Placeholder text for the form field',
          example: 'Please enter your email address',
          nullable: true,
        },
        is_required: {
          type: 'boolean',
          description: 'Whether the field is required',
          example: false,
          nullable: true,
        },
        validation_rules: {
          type: 'object',
          description: 'Validation rules for the form field',
          example: {
            minLength: 5,
            maxLength: 100,
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          },
          nullable: true,
        },
        form_question_id: {
          type: 'integer',
          minimum: 1,
          description: 'ID of the form question this field belongs to',
          example: 2,
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata for the form field',
          example: { autocomplete: 'email', inputmode: 'email', updated: true },
          nullable: true,
        },
      },
    },
    examples: {
      updatePlaceholder: {
        summary: 'Update placeholder only',
        value: {
          placeholder: 'Please enter your email address',
        },
      },
      updateMultipleFields: {
        summary: 'Update multiple fields',
        value: {
          field_name: 'user_email',
          placeholder: 'Enter your work email',
          is_required: false,
          validation_rules: { minLength: 5, maxLength: 100 },
          metadata: { autocomplete: 'work email', updated: true },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Form field updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        field_name: { type: 'string', example: 'user_email' },
        field_type: { type: 'string', example: 'email' },
        placeholder: {
          type: 'string',
          example: 'Enter your work email',
          nullable: true,
        },
        is_required: { type: 'boolean', example: false, nullable: true },
        validation_rules: {
          type: 'object',
          example: { minLength: 5, maxLength: 100 },
          nullable: true,
        },
        form_question_id: { type: 'integer', example: 2 },
        metadata: {
          type: 'object',
          example: { autocomplete: 'work email', updated: true },
          nullable: true,
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
    description: 'Form field not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'FormField with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during form field update',
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
    @Body() updateFormFieldDto: UpdateFormFieldDto,
  ) {
    return this.formFieldService.update(id, updateFormFieldDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete form field',
    description: 'Soft deletes a form field by setting the deletedAt timestamp',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Form field ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Form field deleted successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        field_name: { type: 'string', example: 'email_address' },
        field_type: { type: 'string', example: 'email' },
        placeholder: {
          type: 'string',
          example: 'Enter your email address',
          nullable: true,
        },
        is_required: { type: 'boolean', example: true, nullable: true },
        validation_rules: {
          type: 'object',
          example: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          },
          nullable: true,
        },
        form_question_id: { type: 'integer', example: 1 },
        metadata: {
          type: 'object',
          example: { autocomplete: 'email', inputmode: 'email' },
          nullable: true,
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
    description: 'Invalid form field ID parameter',
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
    description: 'Form field not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'FormField with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during form field deletion',
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
    return this.formFieldService.remove(id);
  }
}
