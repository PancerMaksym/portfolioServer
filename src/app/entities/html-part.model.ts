import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HtmlPart {
  @Field()
  id!: string;

  @Field()
  content!: string;
}