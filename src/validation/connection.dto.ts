import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateConnection {
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsNumber()
  @IsOptional()
  readonly a_end_port_id?: number;
  @IsNumber()
  @IsOptional()
  readonly b_end_port_id?: number;
  @IsNumber()
  @IsOptional()
  readonly a_end_vlan_id?: number;
  @IsNumber()
  @IsOptional()
  readonly b_end_vlan_id?: number;
  @IsString()
  @IsOptional()
  readonly link_type?: string;
  @IsString()
  @IsOptional()
  readonly speed?: string;
  @IsString()
  @IsOptional()
  readonly subnet?: string;
}
