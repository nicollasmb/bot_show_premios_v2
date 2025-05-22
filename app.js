const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const JsonFileAdapter = require("@bot-whatsapp/database/json");

const usersAnswered = new Set();

const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { flowDynamic, endFlow }) => {
    const userId = ctx.from;
    if (usersAnswered.has(userId)) {
      return endFlow();
    }
    usersAnswered.add(userId);
  })
  .addAnswer(
    "Olá! 👋 Seja bem-vindo(a) à *Central de Vendas do Show de Prêmios*! 🎉",
    { delay: 1000 }
  )
  .addAnswer(
    "Vou te explicar rapidinho como garantir suas cartelas pra *concorrer a R$ 35.000* em prêmios. 👇",
    { delay: 2000 }
  )
  .addAnswer(
    "*Cada cartela custa apenas R$10,00* 💰\n\nE é super fácil de comprar:",
    { delay: 2500 }
  )
  .addAnswer(
    "1️⃣ Faça um PIX com o valor correspondente à quantidade de cartelas que deseja.\n\n2️⃣ Use a chave PIX CNPJ: *07.291.547/0001-32* (Paróquia Santo Antônio)",
    { delay: 3000 }
  )
  .addAnswer(
    "3️⃣ Envie aqui o *comprovante do pagamento*. Assim que confirmarmos, mandaremos uma foto das suas cartelas! 🧾",
    { delay: 3000 }
  )
  .addAnswer(
    "✅ Pronto! Agora é só enviar o comprovante aqui e a gente cuida do resto. 😉\n\n*Qualquer dúvida, pode me chamar!*",
    { delay: 3500 }
  );

const main = async () => {
  const adapterDB = new JsonFileAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
