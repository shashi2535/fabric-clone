import { IsNotEmpty, IsString } from 'class-validator';
export class CreateMintermDto {
  @IsString()
  @IsNotEmpty()
  readonly term_name: string;
  @IsString()
  @IsNotEmpty()
  readonly term_number: string;
}
