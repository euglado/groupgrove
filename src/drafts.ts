import { randomBytes } from "node:crypto";
import type { Language, Plan } from "./plan.ts";

export type Context = { owner: string; guild: string; channel: string };
export type Draft = Context & {
  plan: Plan;
  lang: Language;
  message: string;
  expires: number;
};

export class DraftError extends Error {}

export class Drafts {
  readonly entries = new Map<string, Draft>();
  readonly forms = new Map<string, number>();
  readonly shares = new Map<string, number>();
  readonly busy = new Set<string>();
  readonly now: () => number;
  constructor(now: () => number = Date.now) {
    this.now = now;
  }
  prune(): void {
    const now = this.now();
    for (const [id, draft] of this.entries) if (draft.expires <= now) this.entries.delete(id);
    for (const map of [this.forms, this.shares]) {
      for (const [id, expiry] of map) if (expiry <= now) map.delete(id);
    }
  }
  form(context: Context): void {
    this.prune();
    const key = `${context.guild}:${context.owner}`;
    if (this.forms.has(key)) throw new DraftError("Wait 5 seconds. / 5 saniye bekleyin.");
    if (this.forms.size >= 1000 || this.entries.size >= 100) {
      throw new DraftError(
        "Preview capacity reached. Try later. / Önizleme kapasitesi dolu. Sonra deneyin.",
      );
    }
    this.forms.set(key, this.now() + 5000);
  }
  create(context: Context, plan: Plan, lang: Language): string {
    this.prune();
    if (this.entries.size >= 100)
      throw new DraftError("Preview capacity reached. / Önizleme kapasitesi dolu.");
    const id = randomBytes(16).toString("hex");
    this.entries.set(id, { ...context, plan, lang, message: "", expires: this.now() + 300000 });
    return id;
  }
  bind(id: string, message: string): void {
    const draft = this.entries.get(id);
    if (draft) draft.message = message;
  }
  take(id: string, context: Context, message: string): Draft {
    this.prune();
    const draft = this.entries.get(id);
    if (
      !draft ||
      !message ||
      draft.message !== message ||
      draft.owner !== context.owner ||
      draft.guild !== context.guild ||
      draft.channel !== context.channel
    ) {
      throw new DraftError(
        "Preview expired or belongs elsewhere. Run /groupgrove again. / Önizleme bitti veya size ait değil. /groupgrove komutunu yeniden kullanın.",
      );
    }
    this.entries.delete(id);
    return draft;
  }
  beginShare(channel: string): void {
    this.prune();
    if (this.busy.has(channel) || this.shares.has(channel)) {
      throw new DraftError(
        "Wait a minute before sharing in this channel. / Bu kanalda paylaşmadan önce bir dakika bekleyin.",
      );
    }
    if (this.shares.size >= 1000 || this.busy.size >= 100) {
      throw new DraftError("Sharing capacity reached. / Paylaşım kapasitesi dolu.");
    }
    this.busy.add(channel);
    this.shares.set(channel, this.now() + 60000);
  }
  endShare(channel: string): void {
    this.busy.delete(channel);
  }
}
