import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateLevelDto } from './create-level.dto';

export class UpdateLevelDto extends PartialType(CreateLevelDto) {
  @ApiProperty({ 
    description: 'Banner image filename',
    required: false
  })
  banner?: string | null;

  @ApiProperty({ 
    description: 'Flag to remove the banner',
    required: false,
    default: false
  })
  removeBanner?: boolean;
}
