# Use a imagem oficial do Node com Chromium
FROM node:20-slim

# Instale dependências do Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Cria diretório do app
WORKDIR /app

# Copia os arquivos
COPY package*.json ./
RUN npm install
COPY . .

# Expõe a porta padrão (altere se necessário)
EXPOSE 3000

# Comando para iniciar o bot
CMD ["node", "bot.js"]
