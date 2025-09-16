import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LevelType } from "../enums/level-type.enum";

export class CreateLevelDto {
    @ApiProperty({ description: 'The level number', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    level: number;

    @ApiProperty({ 
        description: 'Banner image filename',
        required: false
    })
    @IsString()
    @IsOptional()
    banner?: string;

    @ApiProperty({ 
        enum: LevelType,
        description: 'Type of the level',
        example: LevelType.QUIZ
    })
    @IsNotEmpty()
    @IsEnum(LevelType)
    type: string;
}
