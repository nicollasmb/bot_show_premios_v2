const { create, ev } = require("@open-wa/wa-automate");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const respondedUsers = new Set();

app.use(express.static("."));

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

create({
  sessionId: "bot",
  multiDevice: true,
  headless: true,
  qrTimeout: 0,
  authTimeout: 60,
  cacheEnabled: false,
  useChrome: false,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
  chromiumArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-extensions",
    "--disable-dev-tools",
    "--disable-software-rasterizer",
    "--disable-sync",
    "--headless=new",
  ],
  killProcessOnBrowserClose: true,
  qrRefreshS: 15,
  qrLogSkip: false,
  qrCallback: (base64Qr) => {
    const base64Data = base64Qr.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(path.join(__dirname, "qr-code.png"), base64Data, "base64");
    console.log("QR code salvo como qr-code.png");
  },
}).then((client) => {
  console.log("🤖 Bot iniciado com sucesso!");

  client.onMessage(async (message) => {
    const user = message.from;

    if (!respondedUsers.has(user) && !message.isGroupMsg) {
      respondedUsers.add(user);

      await client.sendSeen(user);
      await client.startTyping(user);
      await delay(500);
      await client.sendText(
        user,
        "Olá! 👋 Seja bem-vindo(a) à *Central de Vendas do Show de Prêmios*! 🎉"
      );

      await client.startTyping(user);
      await delay(1200);
      await client.sendText(
        user,
        "Vou te explicar rapidinho como garantir suas cartelas pra concorrer a R$ 35.000 em prêmios. 👇"
      );

      await client.startTyping(user);
      await delay(1800);
      await client.sendText(
        user,
        "*Cada cartela custa apenas R$10,00* 💰\n\nE é super fácil de comprar:"
      );

      await client.startTyping(user);
      await delay(1500);
      await client.sendText(
        user,
        "1️⃣ Faça um PIX com o valor correspondente à quantidade de cartelas que deseja.\n\n2️⃣ Use essa chave PIX: *07.291.547/0001-32* (Paróquia Santo Antônio)"
      );

      await client.startTyping(user);
      await delay(1500);
      await client.sendText(
        user,
        "3️⃣ Envie aqui o *comprovante do pagamento*. Assim que confirmarmos, mandaremos uma foto das suas cartelas! 🧾"
      );

      await client.startTyping(user);
      await delay(2500);
      await client.sendText(
        user,
        "✅ Pronto! Agora é só enviar o comprovante aqui e a gente cuida do resto. 😉\n\n*Qualquer dúvida, pode me chamar!*"
      );
    }
  });
});
