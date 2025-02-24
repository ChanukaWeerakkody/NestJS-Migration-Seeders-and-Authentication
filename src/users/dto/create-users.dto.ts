import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  contact_number: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  password:string

  @IsNotEmpty()
  business_id:number
  
  @IsNotEmpty()
  role_id:number

  @IsNotEmpty()
  permission:CreateUserRolePermissionDto[]
}

export class CreateUserRolePermissionDto{
  @IsNotEmpty()
  resource_id:number
  @IsNotEmpty()
  permission:string
}

