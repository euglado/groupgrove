import { Client, Events, GatewayIntentBits, Options } from "discord.js";
import { config } from "./config.ts";
import { Drafts } from "./drafts.ts";
import { createHandler } from "./handler.ts";

async function main(): Promise<void> {
  const settings = config();
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    makeCache: Options.cacheWithLimits({
      MessageManager: 0,
      GuildMemberManager: {
        maxSize: 100,
        keepOverLimit: (member) => member.id === member.client.user?.id,
      },
    }),
    allowedMentions: { parse: [], repliedUser: false },
    rest: { retries: 0, timeout: 10000, rejectOnRateLimit: () => true },
  });
  const drafts = new Drafts();
  const sweep = setInterval(() => drafts.prune(), 30000);
  sweep.unref();
  client.once(Events.ClientReady, (ready) => {
    if (ready.user.id !== settings.application) {
      console.error(
        "Application ID does not match token. / Uygulama kimliği token ile eşleşmiyor.",
      );
      client.destroy();
      process.exitCode = 1;
      return;
    }
    console.log("GroupGrove connected. / GroupGrove bağlandı.");
  });
  client.on(Events.InteractionCreate, createHandler(settings.guild, drafts));
  client.on(Events.Error, () =>
    console.error("Discord connection error. / Discord bağlantı hatası."),
  );
  const stop = () => {
    clearInterval(sweep);
    client.destroy();
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  await client.login(settings.token);
}
main().catch(() => {
  console.error(
    "Startup failed. Run npm run setup; check token and network. / Başlatılamadı. npm run setup çalıştırın; token ve ağı kontrol edin.",
  );
  process.exitCode = 1;
});
