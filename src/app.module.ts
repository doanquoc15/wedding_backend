import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./common/guards";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { MenuItemModule } from "./menu-item/menu-item.module";
import { ServiceModule } from "./service/service.module";
import { TypeDishModule } from "./type-dish/type-dish.module";
import { EmployeeModule } from "./employee/employee.module";
import { ComboMenuModule } from "./combo-menu/combo-menu.module";
import { StripeModule } from "./stripe/stripe.module";
import { CustomizedComboModule } from './customized-combo/customized-combo.module';
import { ZoneModule } from './zone/zone.module';
import { MailModule } from './mail/mail.module';
import { BookModule } from './book/book.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    MenuItemModule,
    ServiceModule,
    TypeDishModule,
    EmployeeModule,
    ComboMenuModule,
    StripeModule,
    CustomizedComboModule,
    ZoneModule,
    MailModule,
    BookModule,
    CloudinaryModule,
    FeedbackModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
   ],
})
export class AppModule {}
