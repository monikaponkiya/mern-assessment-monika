import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductEntriesDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  sizeId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  colorId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  price: string;
}
