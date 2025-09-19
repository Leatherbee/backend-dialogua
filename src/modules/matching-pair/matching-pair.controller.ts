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
import { MatchingPairService } from './matching-pair.service';
import { CreateMatchingPairDto, UpdateMatchingPairDto } from './dto';

@Controller('matching-pairs')
export class MatchingPairController {
  constructor(private readonly matchingPairService: MatchingPairService) {}

  @Post()
  create(@Body() createMatchingPairDto: CreateMatchingPairDto) {
    return this.matchingPairService.create(createMatchingPairDto);
  }

  @Get()
  findAll(@Query('matchingQuestionId') matchingQuestionId?: string) {
    if (matchingQuestionId) {
      return this.matchingPairService.findByMatchingQuestion(
        +matchingQuestionId,
      );
    }
    return this.matchingPairService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchingPairService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchingPairDto: UpdateMatchingPairDto,
  ) {
    return this.matchingPairService.update(+id, updateMatchingPairDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchingPairService.remove(+id);
  }
}
