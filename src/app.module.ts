import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { ProfileModule } from './profile/profile.module';
import { DocumentsCatalogModule } from './documents-catalog/documents-catalog.module';
import { DocumentsModule } from './documents/documents.module';
import { UserDevicesModule } from './user-devices/user-devices.module';
import { StatusPolicyNumberModule } from './status-policy-number/status-policy-number.module';
import { UserTokenModule } from './user-token/user-token.module';
import { IsUniqueConstraint } from './auth/is-unique-constraint';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    PropertiesModule,
    ProfileModule,
    DocumentsCatalogModule,
    DocumentsModule,
    UserDevicesModule,
    StatusPolicyNumberModule,
    UserTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
