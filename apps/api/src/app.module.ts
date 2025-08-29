import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PgModule } from './postgres/pg.module';
import { UrlModule } from './urls/url.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UrlTrackingModule } from './url-tracking/url-tracking.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/access-token.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    PgModule,
    UrlModule,
    AuthModule,
    UserModule,
    UrlTrackingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule { }
