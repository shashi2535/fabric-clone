import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly org_code: string;
  @IsString()
  @IsNotEmpty()
  readonly org_name: string;

  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}
