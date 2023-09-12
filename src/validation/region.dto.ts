import { IsNotEmpty, IsString } from 'class-validator';
export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  readonly region_name: string;
  @IsString()
  @IsNotEmpty()
  readonly region_code: string;
}
