import { Field, Int, ObjectType, HideField } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  email!: string;

  @HideField()
  @Column()
  password!: string;

  @Field(() => Int, { nullable: true })
  @Column()
  profile_id?: number;
}
