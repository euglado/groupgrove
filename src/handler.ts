import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Interaction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { DraftError, Drafts } from "./drafts.ts";
import { AccessError, publicationChannel } from "./permissions.ts";
import { InputError, planGroups, renderPlan } from "./plan.ts";

const mentions = { parse: [] as ("users" | "roles" | "everyone")[], repliedUser: false };
const failure =
  "Could not complete the request. Check permissions and connection, then create a fresh preview. A failed share may already be visible; inspect the channel before retrying. / İstek tamamlanamadı. İzinleri ve bağlantıyı kontrol edip yeni önizleme oluşturun. Başarısız paylaşım görünmüş olabilir; tekrar denemeden kanalı kontrol edin.";

export function createHandler(guildId: string, drafts = new Drafts()) {
  return async function handle(i: Interaction): Promise<void> {
    if (
      !(i.isChatInputCommand() && i.commandName === "groupgrove") &&
      !(i.isButton() && i.customId.startsWith("gg:"))
    )
      return;
    try {
      if (
        !i.inGuild() ||
        i.guildId !== guildId ||
        !i.guild ||
        !i.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
      ) {
        throw new AccessError(
          "Use this bot in its configured server with Manage Server permission. / Botu ayarlı sunucuda Sunucuyu Yönet izniyle kullanın.",
        );
      }
      const context = { owner: i.user.id, guild: i.guildId, channel: i.channelId };
      if (i.isChatInputCommand()) {
        drafts.form(context);
        const plan = planGroups(
          i.options.getInteger("participants", true),
          i.options.getInteger("minimum", true),
          i.options.getInteger("maximum", true),
          i.options.getInteger("groups") ?? undefined,
        );
        const lang =
          i.options.getString("language") === "tr" ||
          (!i.options.getString("language") && i.locale === "tr")
            ? "tr"
            : "en";
        await i.deferReply({ flags: MessageFlags.Ephemeral });
        await publicationChannel(i.guild, i.user.id, i.channelId);
        const id = drafts.create(context, plan, lang);
        try {
          const message = await i.editReply({
            content: `${renderPlan(plan, lang)}\n\n${lang === "tr" ? "Özel önizleme · 5 dakika. Paylaş bu kanala gönderir." : "Private preview · 5 minutes. Share posts in this channel."}`,
            allowedMentions: mentions,
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId(`gg:share:${id}`)
                  .setLabel(lang === "tr" ? "Bu kanalda paylaş" : "Share in this channel")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId(`gg:cancel:${id}`)
                  .setLabel(lang === "tr" ? "Vazgeç" : "Discard")
                  .setStyle(ButtonStyle.Secondary),
              ),
            ],
          });
          drafts.bind(id, message.id);
        } catch (error) {
          drafts.entries.delete(id);
          throw error;
        }
        return;
      }
      if (!i.isButton()) return;
      const match = /^gg:(share|cancel):([a-f0-9]{32})$/.exec(i.customId);
      if (!match?.[2]) throw new InputError("Invalid button. / Geçersiz düğme.");
      // Consume synchronously, before any network await: duplicate clicks cannot publish twice.
      const draft = drafts.take(match[2], context, i.message.id);
      await i.deferUpdate();
      if (match[1] === "cancel") {
        await i.editReply({
          content: "Discarded. / Vazgeçildi.",
          components: [],
          allowedMentions: mentions,
        });
        return;
      }
      let acquired = false;
      try {
        drafts.beginShare(i.channelId);
        acquired = true;
        const channel = await publicationChannel(i.guild, i.user.id, i.channelId);
        await channel.send({
          content: renderPlan(draft.plan, draft.lang),
          allowedMentions: mentions,
          flags: MessageFlags.SuppressEmbeds,
          nonce: i.id,
          enforceNonce: true,
        });
        await i.editReply({
          content: "Shared in this channel. / Bu kanalda paylaşıldı.",
          components: [],
          allowedMentions: mentions,
        });
      } finally {
        if (acquired) drafts.endShare(i.channelId);
      }
    } catch (error) {
      // Only errors created locally are safe to show; SDK/network errors may contain secrets.
      const content =
        error instanceof AccessError || error instanceof InputError || error instanceof DraftError
          ? error.message
          : failure;
      try {
        if (i.deferred || i.replied)
          await i.editReply({ content, components: [], allowedMentions: mentions });
        else await i.reply({ content, flags: MessageFlags.Ephemeral, allowedMentions: mentions });
      } catch {
        console.error("Interaction response unavailable. / Etkileşim yanıtı gönderilemedi.");
      }
    }
  };
}
