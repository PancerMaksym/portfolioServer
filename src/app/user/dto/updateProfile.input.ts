import { Field, InputType } from '@nestjs/graphql';
import { HtmlPartInput } from './html_part.input';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  photo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  places?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field(() => [HtmlPartInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HtmlPartInput)
  html_part?: HtmlPartInput[];
}
