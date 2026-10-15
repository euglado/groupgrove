import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const command = new SlashCommandBuilder()
  .setName("groupgrove")
  .setDescription("Privately plan balanced workshop group sizes")
  .setDescriptionLocalizations({ tr: "Dengeli atölye grup büyüklüklerini özel olarak planla" })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addIntegerOption((o) =>
    o
      .setName("participants")
      .setDescription("Total people (2–1000)")
      .setDescriptionLocalizations({ tr: "Toplam kişi (2–1000)" })
      .setMinValue(2)
      .setMaxValue(1000)
      .setRequired(true),
  )
  .addIntegerOption((o) =>
    o
      .setName("minimum")
      .setDescription("Minimum people per group (2–50)")
      .setDescriptionLocalizations({ tr: "Grup başına en az kişi (2–50)" })
      .setMinValue(2)
      .setMaxValue(50)
      .setRequired(true),
  )
  .addIntegerOption((o) =>
    o
      .setName("maximum")
      .setDescription("Maximum people per group (2–50)")
      .setDescriptionLocalizations({ tr: "Grup başına en çok kişi (2–50)" })
      .setMinValue(2)
      .setMaxValue(50)
      .setRequired(true),
  )
  .addIntegerOption((o) =>
    o
      .setName("groups")
      .setDescription("Optional group count; default is the fewest feasible groups")
      .setDescriptionLocalizations({
        tr: "İsteğe bağlı grup sayısı; varsayılan en az uygun grup sayısıdır",
      })
      .setMinValue(1)
      .setMaxValue(500),
  )
  .addStringOption((o) =>
    o
      .setName("language")
      .setDescription("Plan language / Plan dili")
      .addChoices({ name: "Türkçe", value: "tr" }, { name: "English", value: "en" }),
  );
