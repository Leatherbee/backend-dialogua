import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UnitLevelService } from './unit-level.service';
import { CreateUnitLevelDto, UpdateUnitLevelDto } from './dto';

@Controller('unit-level')
export class UnitLevelController {
  constructor(private readonly unitLevelService: UnitLevelService) {}

  @Post()
  create(@Body() createUnitLevelDto: CreateUnitLevelDto) {
    return this.unitLevelService.create(createUnitLevelDto);
  }

  @Get()
  findAll(@Query('unitId', ParseIntPipe) unitId?: number) {
    if (unitId) {
      return this.unitLevelService.findByUnit(unitId);
    }
    return this.unitLevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitLevelService.findOne(id);
  }

  @Get('unit/:unitId')
  findByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.unitLevelService.findByUnit(unitId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitLevelDto: UpdateUnitLevelDto,
  ) {
    return this.unitLevelService.update(id, updateUnitLevelDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitLevelService.remove(id);
  }
}
