import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./common/guards";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { MenuModule } from './menu/menu.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { ServiceModule } from './service/service.module';
import { TypeDishModule } from './type-dish/type-dish.module';
import { EmployeeModule } from './employee/employee.module';

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
    MenuModule,
    MenuItemModule,
    ServiceModule,
    TypeDishModule,
    EmployeeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
