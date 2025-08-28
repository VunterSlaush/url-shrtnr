import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PgModule } from './postgres/pg.module';
import { UrlModule } from './urls/url.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    PgModule,
    UrlModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
