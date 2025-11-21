import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/createUser.input';
import { User } from '../entities/users.entity';
import { Res } from '@nestjs/common';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.authService.register(createUserInput);
  }

  @Mutation(() => String)
  async login(
    @Args('createUserInput') userInput: CreateUserInput,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.login(res, userInput);
  }

  @Mutation(() => String)
  async updateUser(
    @Args('token') token: string,
    @Args('password') password: string
  ) {
    return await this.authService.updateUser(token, password);
  }

  @Mutation(() => String)
  async sendEmail(@Args('email') email: string) {
    return await this.authService.sendEmail(email);
  }

  @Mutation(() => String)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return "Logged out";
  }
}
