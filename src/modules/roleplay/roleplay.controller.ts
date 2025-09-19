import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleplayService } from './roleplay.service';
import { CreateRoleplayDto, UpdateRoleplayDto } from './dto';
import { Roleplay } from './entities/roleplay.entity';

@Controller('roleplay')
export class RoleplayController {
  constructor(private readonly roleplayService: RoleplayService) {}

  @Post()
  create(@Body() createRoleplayDto: CreateRoleplayDto) {
    return this.roleplayService.create(createRoleplayDto);
  }

  @Get()
  findAll(@Query('contentItemId') contentItemId?: string) {
    if (contentItemId) {
      return this.roleplayService.findByContentItem(+contentItemId);
    }
    return this.roleplayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleplayService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleplayDto: UpdateRoleplayDto,
  ): Promise<Roleplay> {
    return await this.roleplayService.update(+id, updateRoleplayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleplayService.remove(+id);
  }
}
