import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PgModule } from './postgres/pg.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    PgModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
