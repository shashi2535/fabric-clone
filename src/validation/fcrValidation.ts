import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateFcrDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly term: string;
  @IsNumber()
  @IsNotEmpty()
  readonly asn: number;
  @IsString()
  @IsNotEmpty()
  readonly router_id: string;
  @IsString()
  @IsNotEmpty()
  readonly bgp_state: string;
  @IsString()
  @IsNotEmpty()
  readonly type: string;
  @IsNumber()
  @IsNotEmpty()
  readonly region_id: number;
  @IsNumber()
  @IsNotEmpty()
  readonly dc_id: number;
  @IsString()
  @IsNotEmpty()
  readonly speed: string;
}
