import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CreateUserInput } from '../user/dto/createUser.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async login(userInput: CreateUserInput) {
    const user = await this.userRepo.findOneBy({ email: userInput.email });
    if (!user) {
      throw new Error('Wrong data');
    }

    const isPasswordValid = await bcrypt.compare(
      userInput.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Wrong data');
    }

    const payload = { id: user.id, email: user.email };

    return await this.jwtService.signAsync(payload);
  }

  async register(createUserInput: CreateUserInput) {
    try {
      const userCheck = await this.userRepo.findOneBy({
        email: createUserInput.email,
      });
      if (userCheck) {
        throw new Error('Email already registered');
      }

      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(
        createUserInput.password,
        saltRounds
      );

      const user = this.userRepo.create({
        ...createUserInput,
        password: hashedPassword,
        profile: {
          photo: '',
          name: '',
          places: [],
          tags: [],
          html_parts: [],
        },
      });

      await this.userRepo.save(user);

      return "Success";
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(token: string, password: string) {
    const payload = await this.jwtService.verifyAsync(token);
    const user = await this.userRepo.findOneByOrFail({ email: payload.email });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);

    return 'Success';
  }

  async sendEmail(email: string) {
    try {
      const token = await this.jwtService.signAsync(
        { email },
        { expiresIn: '15m' }
      );

      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL_USER,
        subject: 'Reset your password',
        text: `Click here to reset your password: ${process.env.FRONT_DOMAIN}/reset?token=${token}`,
      });

      return 'Success';
    } catch (error) {
      console.error(error);
      throw new Error('Email sending failed');
    }
  }
}
