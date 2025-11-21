import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs(
  'dbconfig.dev',
  (): PostgresConnectionOptions => ({
    url: process.env.DATABASE_URL,
    type: 'postgres',

    entities: [path.join(__dirname, '..', '**/*.entity.{js,ts}')],

    synchronize: true,
  }),
);