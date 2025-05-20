FROM node:20-slim

# Instala dependências necessárias para o Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
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
    wget \
    curl \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Define variável de ambiente para o caminho do Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copia arquivos e instala dependências
COPY package*.json ./
RUN npm config set puppeteer_skip_chromium_download true
RUN npm install
COPY . .

# Expõe a porta (se necessário)
EXPOSE 3000

CMD ["node", "bot.js"]
