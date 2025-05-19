const venom = require("venom-bot");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

let latestQR = null;

// Cria a sessão do Venom
venom
  .create(
    {
      session: "bot",
      multidevice: true,
      headless: true, // ✅ NÃO TENTARÁ ABRIR NAVEGADOR
      useChrome: true,
      logQR: false, // não precisa mostrar no terminal
      browserArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
      puppeteerOptions: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      },
      disableWelcome: true,
      updatesLog: false,
      autoClose: false,
      createPathFileToken: true,
      qrTimeout: 0,
      qrRefreshS: 30,
      killProcessOnBrowserClose: false,
    },
    (base64Qrimg) => {
      latestQR = base64Qrimg; // Atualiza o QR mais recente
    }
  )
  .then((client) => start(client))
  .catch((err) => console.error("Erro ao iniciar o bot:", err));

// Função para lidar com mensagens recebidas
function start(client) {
  client.onMessage(async (message) => {
    const user = message.from;

    if (!message.isGroupMsg) {
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
}

// Pequeno delay para simular digitação
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Página principal
app.get("/", (req, res) => {
  res.send("🤖 Bot Show de Prêmios está rodando!");
});

// Exibe o QR code
app.get("/qr", (req, res) => {
  if (latestQR) {
    res.send(
      `<img src="${latestQR}" style="width:300px;height:300px;" alt="QR Code do Bot">`
    );
  } else {
    res.send("QR Code ainda não gerado. Aguarde ou recarregue.");
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web escutando na porta ${PORT}`);
});
