import {
  ChannelType,
  type Guild,
  type GuildTextBasedChannel,
  PermissionFlagsBits as P,
} from "discord.js";

export class AccessError extends Error {}
export async function publicationChannel(
  guild: Guild,
  owner: string,
  channelId: string,
): Promise<GuildTextBasedChannel> {
  await guild.fetch();
  await guild.roles.fetch();
  const [member, bot, channel] = await Promise.all([
    guild.members.fetch({ user: owner, force: true }),
    guild.members.fetchMe({ force: true }),
    guild.channels.fetch(channelId, { force: true }),
  ]);
  if (!channel || channel.type !== ChannelType.GuildText || channel.guildId !== guild.id) {
    throw new AccessError(
      "Use a regular server text channel. / Normal bir sunucu metin kanalı kullanın.",
    );
  }
  const userPermissions = channel.permissionsFor(member);
  const botPermissions = channel.permissionsFor(bot);
  if (
    !member.permissions.has(P.ManageGuild) ||
    member.pending ||
    (member.communicationDisabledUntilTimestamp ?? 0) > Date.now() ||
    !userPermissions?.has([P.ViewChannel, P.SendMessages, P.UseApplicationCommands]) ||
    !botPermissions?.has([P.ViewChannel, P.SendMessages]) ||
    bot.pending ||
    bot.permissions.has(P.Administrator) ||
    (bot.communicationDisabledUntilTimestamp ?? 0) > Date.now() ||
    (channel.rateLimitPerUser ?? 0) > 0
  ) {
    throw new AccessError(
      "Sharing unavailable: check Manage Server, channel access, timeout, slowmode and bot permissions (no Administrator). / Paylaşım kullanılamıyor: Sunucuyu Yönet, kanal erişimi, zaman aşımı, yavaş mod ve bot izinlerini (Yönetici olmadan) kontrol edin.",
    );
  }
  return channel;
}
