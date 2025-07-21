import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, 
      migrations: process.env.NODE_ENV === 'production' 
        ? ['dist/migrations/*.js'] 
        : ['src/migrations/*.ts'],
      migrationsRun: true, 
    }),
    UsersModule,
    InvitesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
