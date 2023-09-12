import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreatePortDto {
  @IsNumber()
  @IsNotEmpty()
  readonly region_id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly dc_id: number;

  @IsString()
  @IsNotEmpty()
  readonly port_speed: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  readonly portName: string;

  @IsString()
  @IsNotEmpty()
  readonly minTerm: string;
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class updatePortDto {
  @IsString()
  @IsOptional()
  readonly minterm: string;

  @IsString()
  @IsOptional()
  readonly marketPlace: string;
}

export class UpdatePortDtoByAdminStatus {
  @IsString()
  @IsNotEmpty()
  @IsEnum({ DEPLOUABLE: 'Deployed' }, { message: 'Value Must Be Deployed' })
  readonly target_admin_status: string;
  @IsString()
  @IsNotEmpty()
  @IsEnum({ INACTIVE: 'Active' }, { message: 'Value Must Be Active' })
  readonly target_operational_status: string;
  @IsString()
  @IsNotEmpty()
  @IsEnum(
    { DEPLOYED: 'Provisioning' },
    { message: 'Value Must Be Provisioning' },
  )
  readonly current_admin_status: string;
  @IsString()
  @IsNotEmpty()
  @IsEnum({ ACTIVE: 'Inactive' }, { message: 'Value Must Be Inactive' })
  readonly current_operational_status: string;
}
