import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ChannelType,
  type Interaction,
  MessageFlags,
  PermissionFlagsBits as P,
  PermissionsBitField,
} from "discord.js";
import { Drafts } from "../src/drafts.ts";
import { createHandler } from "../src/handler.ts";

function fixture() {
  const log: string[] = [];
  const sends: Record<string, unknown>[] = [];
  const edits: Record<string, unknown>[] = [];
  const replies: Record<string, unknown>[] = [];
  const member = {
    permissions: new PermissionsBitField([P.ManageGuild]),
    pending: false,
    communicationDisabledUntilTimestamp: 0,
  };
  const bot = {
    permissions: new PermissionsBitField([P.ViewChannel, P.SendMessages]),
    pending: false,
    communicationDisabledUntilTimestamp: 0,
  };
  const channel = {
    id: "channel",
    guildId: "guild",
    type: ChannelType.GuildText as ChannelType,
    rateLimitPerUser: 0,
    permissionsFor: (who: unknown) =>
      who === member
        ? new PermissionsBitField([P.ViewChannel, P.SendMessages, P.UseApplicationCommands])
        : bot.permissions,
    send: async (payload: Record<string, unknown>) => {
      log.push("send");
      sends.push(payload);
      return { id: "public" };
    },
  };
  const guild = {
    id: "guild",
    fetch: async () => {
      log.push("guild");
    },
    roles: {
      fetch: async () => {
        log.push("roles");
      },
    },
    members: {
      fetch: async (options: { force: boolean }) => {
        assert(options.force);
        log.push("member");
        return member;
      },
      fetchMe: async (options: { force: boolean }) => {
        assert(options.force);
        log.push("bot");
        return bot;
      },
    },
    channels: {
      fetch: async (_id: string, options: { force: boolean }) => {
        assert(options.force);
        log.push("channel");
        return channel;
      },
    },
  };
  const values: Record<string, number> = { participants: 23, minimum: 4, maximum: 6 };
  function interaction(button?: string) {
    return {
      id: "123456789012345678",
      commandName: "groupgrove",
      customId: button ?? "",
      locale: "en",
      user: { id: "owner" },
      guildId: "guild",
      channelId: "channel",
      guild,
      memberPermissions: new PermissionsBitField([P.ManageGuild]),
      deferred: false,
      replied: false,
      message: { id: "private" },
      options: { getInteger: (key: string) => values[key] ?? null, getString: () => null },
      inGuild: () => true,
      isChatInputCommand: () => !button,
      isButton: () => !!button,
      async deferReply(payload: { flags: number }) {
        assert.equal(payload.flags, MessageFlags.Ephemeral);
        this.deferred = true;
        log.push("deferReply");
      },
      async deferUpdate() {
        this.deferred = true;
        log.push("deferUpdate");
      },
      async editReply(payload: Record<string, unknown>) {
        edits.push(payload);
        return { id: "private" };
      },
      async reply(payload: Record<string, unknown>) {
        replies.push(payload);
        this.replied = true;
      },
    };
  }
  const store = new Drafts();
  const handle = createHandler("guild", store);
  const run = (i: ReturnType<typeof interaction>) => handle(i as unknown as Interaction);
  const preview = async () => {
    await run(interaction());
    const id = store.entries.keys().next().value;
    assert(id);
    return id;
  };
  return {
    log,
    sends,
    edits,
    replies,
    member,
    bot,
    channel,
    guild,
    values,
    interaction,
    store,
    run,
    preview,
  };
}

test("private preview sends nothing publicly; explicit share rechecks fresh metadata", async () => {
  const f = fixture();
  const id = await f.preview();
  assert.equal(f.sends.length, 0);
  assert.equal(f.log[0], "deferReply");
  assert.match(String(f.edits[0]?.content), /3 × 6 \+ 1 × 5/);
  await f.run(f.interaction(`gg:share:${id}`));
  assert.equal(f.sends.length, 1);
  assert.equal(f.log.filter((x) => x === "roles").length, 2);
  assert(f.log.indexOf("deferUpdate") < f.log.lastIndexOf("roles"));
  assert.deepEqual(f.sends[0]?.allowedMentions, { parse: [], repliedUser: false });
  assert.equal(f.sends[0]?.flags, MessageFlags.SuppressEmbeds);
  assert.equal(f.sends[0]?.enforceNonce, true);
  assert.equal(f.sends[0]?.nonce, "123456789012345678");
  assert.equal(f.store.entries.size, 0);
  assert.equal(f.store.busy.size, 0);
});
test("discard consumes preview without further REST or public send", async () => {
  const f = fixture();
  const id = await f.preview();
  const count = f.log.filter((x) => x === "guild").length;
  await f.run(f.interaction(`gg:cancel:${id}`));
  assert.equal(f.store.entries.size, 0);
  assert.equal(f.sends.length, 0);
  assert.equal(f.log.filter((x) => x === "guild").length, count);
});
test("concurrent duplicate button clicks publish only once", async () => {
  const f = fixture();
  const id = await f.preview();
  await Promise.all([
    f.run(f.interaction(`gg:share:${id}`)),
    f.run(f.interaction(`gg:share:${id}`)),
  ]);
  assert.equal(f.sends.length, 1);
  assert.equal(f.replies.length, 1);
});
for (const field of ["user", "guildId", "channelId", "message"] as const) {
  test(`reject preview moved to another ${field}`, async () => {
    const f = fixture();
    const id = await f.preview();
    const i = f.interaction(`gg:share:${id}`);
    if (field === "user" || field === "message") i[field] = { id: "other" };
    else i[field] = "other";
    await f.run(i);
    assert.equal(f.sends.length, 0);
    assert.equal(f.replies.length, 1);
  });
}
for (const reason of [
  "manager",
  "member-timeout",
  "pending",
  "bot-timeout",
  "bot-pending",
  "administrator",
  "bot-send",
  "slowmode",
  "thread",
  "other-guild",
  "user-channel",
] as const) {
  test(`publication fails closed after ${reason} changes`, async () => {
    const f = fixture();
    const id = await f.preview();
    if (reason === "manager") f.member.permissions = new PermissionsBitField();
    if (reason === "member-timeout")
      f.member.communicationDisabledUntilTimestamp = Date.now() + 60000;
    if (reason === "pending") f.member.pending = true;
    if (reason === "bot-timeout") f.bot.communicationDisabledUntilTimestamp = Date.now() + 60000;
    if (reason === "bot-pending") f.bot.pending = true;
    if (reason === "administrator") f.bot.permissions.add(P.Administrator);
    if (reason === "bot-send") f.bot.permissions.remove(P.SendMessages);
    if (reason === "slowmode") f.channel.rateLimitPerUser = 1;
    if (reason === "thread") f.channel.type = ChannelType.PublicThread;
    if (reason === "other-guild") f.channel.guildId = "other";
    if (reason === "user-channel") f.channel.permissionsFor = () => new PermissionsBitField();
    await f.run(f.interaction(`gg:share:${id}`));
    assert.equal(f.sends.length, 0);
    assert.equal(f.store.busy.size, 0);
    assert.equal(f.store.entries.size, 0);
    assert(!String(f.edits.at(-1)?.content).includes("Shared in this channel."));
  });
}
test("uncertain send is not retried and errors never expose REST details", async () => {
  const f = fixture();
  const id = await f.preview();
  let attempts = 0;
  f.channel.send = async () => {
    attempts++;
    throw new Error("Wait malicious REST detail must not escape");
  };
  await f.run(f.interaction(`gg:share:${id}`));
  assert.equal(attempts, 1);
  assert.equal(f.store.busy.size, 0);
  assert.equal(f.store.entries.size, 0);
  assert.doesNotMatch(JSON.stringify(f.edits), /malicious REST detail/);
  assert.match(String(f.edits.at(-1)?.content), /may already be visible/);
  await f.run(f.interaction(`gg:share:${id}`));
  assert.equal(attempts, 1);
});
test("fresh permission fetch failure prevents publication", async () => {
  const f = fixture();
  const id = await f.preview();
  f.guild.roles.fetch = async () => {
    throw new Error("network detail");
  };
  await f.run(f.interaction(`gg:share:${id}`));
  assert.equal(f.sends.length, 0);
  assert.doesNotMatch(JSON.stringify(f.edits), /network detail/);
});
test("bad values and missing manager permission produce private errors", async () => {
  const f = fixture();
  f.values.maximum = 3;
  await f.run(f.interaction());
  assert.equal(f.replies[0]?.flags, MessageFlags.Ephemeral);
  assert.equal(f.sends.length, 0);
  const i = f.interaction();
  i.memberPermissions = new PermissionsBitField();
  await f.run(i);
  assert.equal(f.replies.length, 2);
});
test("channel cooldown prevents a second organizer's public share", async () => {
  const f = fixture();
  const first = await f.preview();
  await f.run(f.interaction(`gg:share:${first}`));
  const next = f.interaction();
  next.user.id = "second";
  await f.run(next);
  const second = f.store.entries.keys().next().value;
  assert(second);
  const button = f.interaction(`gg:share:${second}`);
  button.user.id = "second";
  await f.run(button);
  assert.equal(f.sends.length, 1);
  assert.equal(f.store.busy.size, 0);
});
