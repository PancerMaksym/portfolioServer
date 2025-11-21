import { Field, InputType } from "@nestjs/graphql"


@InputType()
export class HtmlPartInput {
  @Field()
  id!: string

  @Field()
  content!: string
}
