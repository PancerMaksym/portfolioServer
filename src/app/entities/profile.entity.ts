import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { HtmlPart } from './html-part.model'

@ObjectType()
@Entity()
export class Profile {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  photo?: string

  @Field()
  @Column()
  name!: string

  @Field(() => [String])
  @Column('text', { array: true })
  places?: string[]

  @Field(() => [String])
  @Column('text', { array: true })
  tags!: string[]

  @Field(() => [HtmlPart])
  @Column('jsonb', { nullable: true })
  html_parts?: { id: string; content: string }[]

  @Field(() => Number)
  @Column()
  author?: number
}
