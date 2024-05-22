import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'password',
    required: true,
    description: 'Description of password',
    example: 'P@ssw0rd',
    type: 'string',
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsString()
  password: string;
}
