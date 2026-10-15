import fs from "node:fs";
import readline from "node:readline/promises";
import { config } from "../src/config.ts";

async function hiddenToken() {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    let value = "";
    const finish = (error) => {
      input.off("data", onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const char of chunk.toString()) {
        if (char === "\u0003") {
          finish(new Error("Cancelled"));
          return;
        }
        if (char === "\r" || char === "\n") {
          finish();
          return;
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else if (/^[A-Za-z0-9_.-]$/.test(char) && value.length < 201) value += char;
      }
    };
    process.stdout.write("Bot token (hidden / gizli): ");
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}

async function setup() {
  if (!process.stdin.isTTY || !process.stdout.isTTY)
    throw new Error("Interactive terminal required / Etkileşimli terminal gerekli");
  if (fs.existsSync(".env"))
    throw new Error(
      ".env exists; stop the bot and remove it manually to reconfigure / .env var; yeniden ayar için botu durdurup dosyayı elle silin",
    );
  console.log("GroupGrove setup / kurulum — no source edits needed / kaynak düzenlemesi gerekmez");
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  let application;
  let guild;
  try {
    application = (await prompt.question("Application ID / Uygulama kimliği: ")).trim();
    guild = (await prompt.question("Server ID / Sunucu kimliği: ")).trim();
  } finally {
    prompt.close();
  }
  const token = await hiddenToken();
  config({ APPLICATION_ID: application, GUILD_ID: guild, DISCORD_TOKEN: token });
  fs.writeFileSync(
    ".env",
    `DISCORD_TOKEN=${token}\nAPPLICATION_ID=${application}\nGUILD_ID=${guild}\n`,
    { flag: "wx", mode: 0o600 },
  );
  console.log(
    "Saved .env locally. Next: npm run register, then npm start. / .env yerelde kaydedildi. Sonra: npm run register, ardından npm start.",
  );
  console.log(
    `Install / Ekle: https://discord.com/oauth2/authorize?client_id=${application}&scope=bot%20applications.commands&permissions=3072&integration_type=0`,
  );
}
setup().catch(() => {
  console.error(
    "Setup stopped without printing secrets. Use an interactive terminal, valid IDs/token and no existing .env. / Kurulum durdu; sırlar yazdırılmadı. Etkileşimli terminal, geçerli kimlik/token ve mevcut olmayan .env kullanın.",
  );
  process.exitCode = 1;
});
