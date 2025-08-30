import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Env } from '../config/env';

const verifyDatabaseConnection = async (pool: Pool) => {
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  console.log('Database connection verified successfully');
};

const poolProvider = {
  provide: 'PG_POOL',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService<Env>) => {
    const pool = new Pool({
      connectionString: configService.getOrThrow('DATABASE_URL'),
      ssl: configService.get('NODE_ENV') === 'production'
        ? {
          rejectUnauthorized: false,
        }
        : false
    });
    await verifyDatabaseConnection(pool);
    return pool;
  },
};

@Module({
  imports: [],
  providers: [poolProvider],
  exports: ['PG_POOL'],
})
export class PgModule { }