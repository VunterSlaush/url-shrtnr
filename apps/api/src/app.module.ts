import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PgModule } from './postgres/pg.module';
import { UrlModule } from './urls/url.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    PgModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
