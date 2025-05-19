const venom = require("venom-bot");
const express = require("express");
const app = express();

// keep latest QR here
let latestQR = "";

/* ---------- VENOM ---------- */
venom
  .create(
    {
      session: "bot",
      multidevice: true,
      headless: true,
      useChrome: true,
      logQR: false,
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
        executablePath:
          process.env.CHROME_BIN || process.env.GOOGLE_CHROME_SHIM,
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
      autoClose: false,
      createPathFileToken: true,
    },
    // QR callback — save the base64
    (base64Qr) => {
      // make sure it is a complete data-URL
      latestQR = base64Qr.startsWith("data:")
        ? base64Qr
        : `data:image/png;base64,${base64Qr}`;
      console.log("QR atualizado");
    }
  )
  .then((client) => {
    console.log("✅ Bot pronto");

    client.onMessage(async (m) => {
      if (m.isGroupMsg) return;

      await client.setPresenceOnline();
      await client.sendText(
        m.from,
        `Olá! 👋 Seja bem-vindo(a) à *Central de Vendas do Show de Prêmios*! 🎉`
      );
      // … resto das mensagens …
    });
  })
  .catch((err) => console.error("Erro ao iniciar o bot:", err));

/* ---------- EXPRESS ---------- */
app.get("/", (_req, res) => {
  res.send("🤖 Bot ativo");
});

app.get("/qr", (_req, res) => {
  if (!latestQR) {
    return res.send("<p>QR ainda não gerado… atualize em alguns segundos.</p>");
  }
  res.send(`
    <h1>Escaneie o QR</h1>
    <img src="${latestQR}" width="300" height="300" />
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 Servidor HTTP na porta ${PORT} — QR em /qr`)
);

/* ---------- helper ------------ */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
