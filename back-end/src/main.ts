import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get app config for cors/helmet settings and starting the app.
  const configService = app.get(ConfigService);
  const appConfig = configService.get('express');

  // Configure OPEN API/Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription(appConfig.description)
    .setVersion(appConfig.version)
    .addServer('/')
    .addServer('/xcode')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // Enable/Disable CORS
  if (Boolean(appConfig.enableCors)) {
    app.enableCors();
  }

  app.useStaticAssets(join(__dirname, '../', 'static-image'), {
    index: false,
    prefix: '/static-image',
  });

  await app.listen(appConfig.port);
}
bootstrap();
