import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //swagger
  const config = new DocumentBuilder()
    .setTitle("Swagger API Restaurant")
    .setDescription("The Restaurant API description")
    .setVersion("1.0")
    .addTag("Auth")
    .addTag("User")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("apis", app, document);
  //cookie
  app.use(cookieParser());
  //cors
  app.enableCors();
  //validate pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Register handlebars helpers
  await app.listen(process.env.PORT || "0.0.0.0", () => {
    console.log("Server run with PORT ", process.env.PORT);
  });
}

bootstrap();
