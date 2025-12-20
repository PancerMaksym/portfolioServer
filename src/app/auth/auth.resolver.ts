import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/createUser.input';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.authService.register(createUserInput);
  }

  @Mutation(() => String)
  async login(
    @Args('createUserInput') userInput: CreateUserInput,
    @Context('res') res: Response,
  ) {
    const token = await this.authService.login(userInput);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return 'Success';
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
  async logout(@Context('res') res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return 'Logged out';
  }
}
