# Estágio 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia arquivos de configuração
COPY package*.json ./
COPY tsconfig*.json ./

# Instala dependências
RUN npm ci

# Copia código fonte
COPY src/ ./src/
COPY ormconfig.ts ./

# Faz o build
RUN npm run build

# Estágio 2: Imagem final de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia arquivos necessários do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ormconfig.ts ./

# Cria usuário para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]