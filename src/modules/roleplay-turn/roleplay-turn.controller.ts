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
import { RoleplayTurnService } from './roleplay-turn.service';
import { CreateRoleplayTurnDto, UpdateRoleplayTurnDto } from './dto';

@Controller('roleplay-turn')
export class RoleplayTurnController {
  constructor(private readonly roleplayTurnService: RoleplayTurnService) {}

  @Post()
  create(@Body() createRoleplayTurnDto: CreateRoleplayTurnDto) {
    return this.roleplayTurnService.create(createRoleplayTurnDto);
  }

  @Get()
  findAll(@Query('roleplayId') roleplayId?: string) {
    if (roleplayId) {
      return this.roleplayTurnService.findByRoleplay(+roleplayId);
    }
    return this.roleplayTurnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleplayTurnService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleplayTurnDto: UpdateRoleplayTurnDto,
  ) {
    return this.roleplayTurnService.update(+id, updateRoleplayTurnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleplayTurnService.remove(+id);
  }
}
