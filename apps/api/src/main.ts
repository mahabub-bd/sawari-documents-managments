import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  function setupSwagger(app: any) {
    const config = new DocumentBuilder()
      .setTitle('sawaribd docs backend api')
      .setDescription('API documentation')
      .setVersion('1.0.0')
      .addServer(process.env.URL)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
}

bootstrap();
