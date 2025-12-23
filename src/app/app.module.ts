import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoModule } from "./photo/photo.module";
import dbConfig from "./config/db.config";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      debug: false,
      playground: false,
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: ["https://create-resume-wheat.vercel.app"],
        credentials: true,
      },
    }),
    UserModule,
    PhotoModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
