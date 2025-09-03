import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'postgres'),
  port: parseInt(configService.get('DB_PORT', '5432')),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_NAME', 'rh_solutions'),
  
  // Otimização para produção vs desenvolvimento
  entities: isProduction 
    ? ['dist/**/*.entity.js']
    : ['src/**/*.entity.ts'],
    
  migrations: isProduction
    ? ['dist/migrations/*.js']
    : ['src/migrations/*.ts'],
    
  // Configurações específicas do ambiente
  synchronize: !isProduction, // Apenas em desenvolvimento
  logging: !isProduction,     // Logs apenas em desenvolvimento
  
  // Configurações de conexão
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
});