import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  productEntryId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  orderValue?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  couponId?: string;
}
