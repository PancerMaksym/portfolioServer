import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { User } from '../entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { Profile } from 'src/app/entities/profile.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        signOptions: {
          expiresIn: '14d',
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Profile]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: "gmail",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
