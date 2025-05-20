const venom = require("venom-bot");

const respondedUsers = new Set();

venom
  .create({
    session: "bot",
    multidevice: true,
    headless: true,
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox", "--headless=new"],
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
