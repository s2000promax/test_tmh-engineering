import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from '../config/app/app.config';
import { setupSwagger } from '../config/open-api/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: appConfig().allowedHeaders,
    origin: appConfig().origins,
    methods: appConfig().methods,
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  if (process.env.VERCEL_NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = appConfig().port;

  await app.listen(port);
}
bootstrap();
