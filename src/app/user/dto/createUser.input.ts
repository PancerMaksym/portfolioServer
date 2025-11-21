import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsEmail()
  @Field()
  email!: string;

  @Field()
  @IsString()
  @MinLength(7)
  password!: string;
}
