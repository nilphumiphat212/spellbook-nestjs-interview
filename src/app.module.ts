import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { dataSourceConfig } from '../config/data-source';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CurrentUserModule } from './current-user/current-user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../config/config';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceConfig),
    PassportModule,
    AuthModule,
    UsersModule,
    CurrentUserModule,
    ProductsModule,
    JwtModule.register({
      global: true,
      secret: Config.jwt.secretKey,
      signOptions: {
        expiresIn: '180s'
      }
    }),
  ],
})
export class AppModule { }
