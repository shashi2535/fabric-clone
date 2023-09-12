import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateDatacenter {
  @IsString()
  @IsNotEmpty()
  readonly dc_code: string;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly portSpeed: string;
  @IsString()
  @IsNotEmpty()
  readonly country: string;
  @IsString()
  @IsNotEmpty()
  readonly city: string;
  @IsString()
  @IsNotEmpty()
  readonly address: string;
  @IsString()
  @IsNotEmpty()
  readonly latitude: string;
  @IsString()
  @IsNotEmpty()
  readonly longitude: string;
  @IsString()
  @IsNotEmpty()
  readonly role: string;
  @IsString()
  @IsNotEmpty()
  readonly stage: string;
  @IsNumber()
  @IsNotEmpty()
  readonly region_id: number;
  @IsNumber()
  @IsNotEmpty()
  readonly min_term: string;
}

export class UpdateDatacenter {
  @IsString()
  @IsOptional()
  readonly dc_code?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  readonly portSpeed?: string;
  @IsString()
  @IsOptional()
  readonly country?: string;
  @IsString()
  @IsOptional()
  readonly city?: string;
  @IsString()
  @IsOptional()
  readonly address?: string;
  @IsString()
  @IsOptional()
  readonly latitude?: string;
  @IsString()
  @IsOptional()
  readonly longitude?: string;
  @IsString()
  @IsOptional()
  readonly role?: string;
  @IsString()
  @IsOptional()
  readonly stage?: string;
  @IsNumber()
  @IsOptional()
  readonly region_id?: number;
  @IsNumber()
  @IsOptional()
  readonly min_term?: string;
}
