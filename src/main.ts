import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Tixflow API')
    .setDescription('The Tixflow API description')
    .setVersion('1.0')
    .addTag('tixflow')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
