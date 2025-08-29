import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';

import { allowSecurityPublicExceptions } from './allow-security-public-exceptions';
import { writeFileSync } from 'fs';

export function initializeSwagger(app: INestApplication) {


  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shrtnr API')
    .setDescription('The Shrtnr API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearerAuth',
    )
    .addSecurityRequirements('bearerAuth') // This Apply Bearer Auth Globally!
    .setVersion('1.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return methodKey;
    },
  });

  allowSecurityPublicExceptions(document);

  SwaggerModule.setup('docs', app, document);

  if (process.env.NODE_ENV === 'development') {
    writeFileSync("./openapi.json", JSON.stringify(document, null, 2));
  }

  return {
    document,
  };
}