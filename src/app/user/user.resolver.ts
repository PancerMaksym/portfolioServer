import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/users.entity';
import { UserService } from './user.service';
import { UpdateProfileInput } from './dto/updateProfile.input';
import { UseGuards } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { UserGuard } from './user.guard';
import { Request } from 'express';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [Profile])
  async findUsers(
    @Args('first', { type: () => Int, nullable: true }) first = 10,
    @Args('cursor', { type: () => Int, nullable: true }) cursor = 0,
    @Args('tags', { type: () => [String], nullable: true }) tags = []
  ): Promise<Profile[]> {
    return await this.userService.findAll(first, cursor, tags);
  }

  @Query(() => Profile)
  async findUser(
    @Args('id', { type: () => Int }) id = 1
  ): Promise<Profile> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => String)
  async updateProfile(
    @Context('req') req: Request,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput
  ) {
    return await this.userService.updateProfile(req, updateProfileInput);
  }

  @Query(() => Profile)
  async getProfile(@Context('req') req: Request) {
    const profile =  await this.userService.getProfile(req);
    return profile;
  }

  @Query(() => [String])
  async getTags() {
    return await this.userService.getTags();
  }

  @Query(() => String)
  test(@Context('req') req) {
    return 'ok';
  }
}
