import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreatePodDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly pod_code: string;

  @IsNumber()
  @IsNotEmpty()
  readonly region_id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly dc_id: number;

  @IsString()
  @IsNotEmpty()
  readonly Switch_number: string;

  @IsString()
  @IsNotEmpty()
  readonly device_name: string;

  @IsString()
  @IsNotEmpty()
  readonly device_type: string;

  @IsString()
  @IsNotEmpty()
  readonly vendor: string;

  @IsString()
  @IsNotEmpty()
  readonly label_name: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsString()
  @IsNotEmpty()
  readonly hosted_on: string;

  @IsString()
  @IsNotEmpty()
  readonly ce_vlan_range: string;

  @IsString()
  @IsNotEmpty()
  readonly throughput: string;
}

export class UpdatePodDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly pod_code: string;

  @IsNumber()
  @IsNotEmpty()
  readonly region_id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly dc_id: number;

  @IsString()
  @IsNotEmpty()
  readonly Switch_number: string;

  @IsString()
  @IsNotEmpty()
  readonly device_name: string;

  @IsString()
  @IsNotEmpty()
  readonly device_type: string;

  @IsString()
  @IsNotEmpty()
  readonly vendor: string;

  @IsString()
  @IsNotEmpty()
  readonly label_name: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsString()
  @IsNotEmpty()
  readonly hosted_on: string;

  @IsString()
  @IsNotEmpty()
  readonly ce_vlan_range: string;

  @IsString()
  @IsNotEmpty()
  readonly throughput: string;
}
