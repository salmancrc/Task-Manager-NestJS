import { TaskPriority } from '@prisma/client';
import {
  IsArray,
  ArrayMaxSize,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Matches(/\S/)
  title!: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;

  @IsArray()
  @ArrayMaxSize(20)
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(40, { each: true })
  @Matches(/\S/, { each: true })
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
