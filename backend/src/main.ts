import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  app.use(
    session({
      name: 'SID',
      secret: process.env.SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  )

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
