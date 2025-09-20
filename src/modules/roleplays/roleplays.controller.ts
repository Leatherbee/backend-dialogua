import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleplaysService } from './roleplays.service';
import { CreateRoleplayDto } from './dto/create-roleplay.dto';
import { UpdateRoleplayDto } from './dto/update-roleplay.dto';

@Controller('roleplays')
export class RoleplaysController {
  constructor(private readonly roleplaysService: RoleplaysService) {}

  @Post()
  create(@Body() createRoleplayDto: CreateRoleplayDto) {
    return this.roleplaysService.create(createRoleplayDto);
  }

  @Get()
  findAll() {
    return this.roleplaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleplaysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleplayDto: UpdateRoleplayDto) {
    return this.roleplaysService.update(+id, updateRoleplayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleplaysService.remove(+id);
  }
}
