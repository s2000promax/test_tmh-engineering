import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { CookiesEnum } from '../enums/cookies.enum';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Сервер Веб-приложения для управления задачами')
    .setDescription(
      'Описание сервера, базирующегося на спецификации OpenAPI 3.0.',
    )
    .addCookieAuth(
      'authCookie',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      CookiesEnum.REFRESH_TOKEN,
    )
    .setVersion('0.1.0')
    .addServer(process.env.VERCEL_REMOTE_SERVER_ADDRESS)
    .addServer(process.env.VERCEL_LOCAL_SERVER_ADDRESS)
    .addTag('status', 'Конечная точка проверки состояния сервера')
    .addTag('auth', 'Конечная точка для операций авторизации')
    .addTag('task', 'Конечная точка для операций с задачей')
    .addTag('user', 'Конечная точка для операций с пользователем')
    .addTag('tags', 'Конечная точка для операций с тегами')
    .addTag('upload', 'Конечная точка для операций с загрузкой файлов')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js',
    ],
    customfavIcon:
      'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAkFBMVEUAAAAQM0QWNUYWNkYXNkYALjoWNUYYOEUXN0YaPEUPMUAUM0QVNUYWNkYWNUYWNUUWNUYVNEYWNkYWNUYWM0eF6i0XNkchR0OB5SwzZj9wyTEvXkA3az5apTZ+4C5DgDt31C9frjU5bz5uxTI/eDxzzjAmT0IsWUEeQkVltzR62S6D6CxIhzpKijpJiDpOkDl4b43lAAAAFXRSTlMAFc304QeZ/vj+ECB3xKlGilPXvS2Ka/h0AAABfklEQVR42oVT2XaCMBAdJRAi7pYJa2QHxbb//3ctSSAUPfa+THLmzj4DBvZpvyauS9b7kw3PWDkWsrD6fFQhQ9dZLfVbC5M88CWCPERr+8fLZodJ5M8QJbjbGL1H2M1fIGfEm+wJN+bGCSc6EXtNS/8FSrq2VX6YDv++XLpJ8SgDWMnwqznGo6alcTbIxB2CHKn8VFikk2mMV2lEnV+CJd9+jJlxXmMr5dW14YCqwgbFpO8FNvJxwwM4TPWPo5QalEsRMAcusXpi58/QUEWPL0AK1ThM5oQCUyXPoPINkdd922VBw4XgTV9zDGWWFrgjIQs4vwvOg6xr+6gbCTqE+DYhlMGX0CF2OknK5gQ2JrkDh/W6TOEbYDeVecKbJtyNXiCfGmW7V93J2hDus1bDfhxWbIZVYDXITA7Lo6E0Ktgg9eB4KWuR44aj7ppBVPazhQH7/M/KgWe9X1qAg8XypT6nxIMJH+T94QCsLvj29IYwZxyO9/F8vCbO9tX5/wDGjEZ7vrgFZwAAAABJRU5ErkJggg==',
  });
}
