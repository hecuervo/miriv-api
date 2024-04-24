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
import { UserDevicesModule } from './user-devices/user-devices.module';
import { StatusPolicyNumberModule } from './status-policy-number/status-policy-number.module';
import { UserTokenModule } from './user-token/user-token.module';
import { IsUniqueConstraint } from './auth/is-unique-constraint';
import { EmailModule } from './email/email.module';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';
import { PropertyCategoriesModule } from './property-categories/property-categories.module';
import { PolicyModule } from './policy/policy.module';
import { PolicyHistoryModule } from './policy-history/policy-history.module';
import { FileManagementModule } from './file-management/file-management.module';
import { SepomexModule } from './sepomex/sepomex.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PropertyPhotosModule } from './property-photos/property-photos.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    DatabaseModule,
    AuthModule,
    PropertiesModule,
    ProfileModule,
    DocumentsCatalogModule,
    UserDevicesModule,
    StatusPolicyNumberModule,
    UserTokenModule,
    EmailModule,
    StorageModule,
    MediaModule,
    PropertyCategoriesModule,
    PolicyModule,
    PolicyHistoryModule,
    FileManagementModule,
    SepomexModule,
    PropertyPhotosModule,
    NotificationsModule,
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
