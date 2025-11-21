import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/users.entity';
import { UserService } from './user.service';
import { UpdateProfileInput } from './dto/updateProfile.input';
import { UseGuards, Request } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { UserGuard } from "./user.guard"

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [Profile])
  async findUsers(
    @Args('first', { type: () => Int, nullable: true }) first = 10,
    @Args('cursor', { type: () => Int, nullable: true }) cursor = 0
  ): Promise<Profile[]> {
    return await this.userService.findAll(first, cursor);
  }

  @Query(() => Profile)
  async findUser(
    @Args('id', { type: () => Int, nullable: true }) id = 0
  ): Promise<Profile> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => Profile)
  @UseGuards(UserGuard)
  async updateProfile(
    @Request() req,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput
  ) {
    return await this.userService.updateProfile(req.user.id, updateProfileInput);
  }

  @Query(() => Profile)
  @UseGuards(UserGuard)
  async getProfile(
    @Request() req,
  ){
    return await this.userService.getProfile(req.user.id);
  }

  @Query(() => [String])
  async getTags(){
    return await this.userService.getTags();
  }
}
