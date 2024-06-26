import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  productName: string;
}
