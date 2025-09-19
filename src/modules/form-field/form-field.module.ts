import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormFieldService } from './form-field.service';
import { FormFieldController } from './form-field.controller';
import { FormField } from './entities/form-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormField])],
  controllers: [FormFieldController],
  providers: [FormFieldService],
  exports: [FormFieldService],
})
export class FormFieldModule {}
