export type Config = { token: string; application: string; guild: string };
export function config(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.DISCORD_TOKEN?.trim() ?? "";
  const application = env.APPLICATION_ID ?? "";
  const guild = env.GUILD_ID ?? "";
  if (
    !/^[A-Za-z0-9_.-]{30,200}$/.test(token) ||
    token === "replace_using_setup" ||
    !/^[1-9]\d{16,19}$/.test(application) ||
    !/^[1-9]\d{16,19}$/.test(guild)
  ) {
    throw new Error(
      "Configuration missing or invalid. Run npm run setup. / Ayarlar eksik veya geçersiz. npm run setup çalıştırın.",
    );
  }
  return { token, application, guild };
}
