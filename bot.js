const venom = require("venom-bot");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const respondedUsers = new Set();

let latestBase64QR = null;

venom
  .create({
    session: "bot",
    multidevice: true,
    headless: true,
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox", "--headless=new"],
    qrCallback: (base64Qrimg, asciiQR, attempts, urlCode) => {
      console.log("QR code received");
      latestBase64QR = base64Qrimg;
    },
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
  })
  .then((client) => {
    client.onMessage(async (message) => {
      const user = message.from;

      if (!respondedUsers.has(user) && message.isGroupMsg === false) {
        respondedUsers.add(user);

        await client.setPresenceOnline();
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

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

app.get("/qr", (req, res) => {
  if (latestBase64QR) {
    const img = Buffer.from(
      latestBase64QR.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } else {
    res.send("QR Code not generated yet. Try again shortly.");
  }
});

// 🚀 Start web server
app.listen(port, () => {
  console.log(`QR server running at http://localhost:${port}/qr`);
});
