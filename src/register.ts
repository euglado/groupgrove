import { REST, Routes } from "discord.js";
import { command } from "./command.ts";
import { config } from "./config.ts";

async function register(): Promise<void> {
  const settings = config();
  const rest = new REST({
    version: "10",
    retries: 0,
    timeout: 10000,
    rejectOnRateLimit: () => true,
  }).setToken(settings.token);
  const me = (await rest.get(Routes.user("@me"))) as { id: string };
  if (me.id !== settings.application) throw new Error("Application mismatch");
  // POST upserts this name only; never bulk-replace other guild commands.
  await rest.post(Routes.applicationGuildCommands(settings.application, settings.guild), {
    body: command.toJSON(),
  });
  console.log("/groupgrove registered. / /groupgrove kaydedildi.");
}
register().catch(() => {
  console.error(
    "Registration failed. Run setup; check IDs, token, installation and network. / Kayıt başarısız. Kurulumu, kimlikleri, tokenı ve ağı kontrol edin.",
  );
  process.exitCode = 1;
});
