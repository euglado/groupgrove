export type Language = "tr" | "en";
export type Plan = {
  participants: number;
  minimum: number;
  maximum: number;
  groups: number;
  firstFeasible: number;
  lastFeasible: number;
  smallSize: number;
  smallCount: number;
  largeSize: number;
  largeCount: number;
};

export class InputError extends Error {}

function integer(value: number, min: number, max: number): void {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new InputError(
      "Use whole numbers within the command limits. / Komut sınırlarında tam sayı kullanın.",
    );
  }
}

export function planGroups(
  participants: number,
  minimum: number,
  maximum: number,
  requested?: number,
): Plan {
  integer(participants, 2, 1000);
  integer(minimum, 2, 50);
  integer(maximum, 2, 50);
  if (minimum > maximum) {
    throw new InputError("Minimum cannot exceed maximum. / Alt sınır üst sınırı aşamaz.");
  }
  const firstFeasible = Math.ceil(participants / maximum);
  const lastFeasible = Math.floor(participants / minimum);
  if (firstFeasible > lastFeasible) {
    throw new InputError(
      "No plan fits these limits. Widen the group size range. / Bu sınırlarda plan yok. Grup büyüklüğü aralığını genişletin.",
    );
  }
  const groups = requested ?? firstFeasible;
  integer(groups, 1, 500);
  if (groups < firstFeasible || groups > lastFeasible) {
    throw new InputError(
      `Choose ${firstFeasible}–${lastFeasible} groups. / ${firstFeasible}–${lastFeasible} grup seçin.`,
    );
  }
  const smallSize = Math.floor(participants / groups);
  const largeCount = participants % groups;
  return {
    participants,
    minimum,
    maximum,
    groups,
    firstFeasible,
    lastFeasible,
    smallSize,
    smallCount: groups - largeCount,
    largeSize: smallSize + 1,
    largeCount,
  };
}

export function renderPlan(plan: Plan, lang: Language): string {
  const parts = [];
  if (plan.largeCount) parts.push(`${plan.largeCount} × ${plan.largeSize}`);
  if (plan.smallCount) parts.push(`${plan.smallCount} × ${plan.smallSize}`);
  if (lang === "tr") {
    return [
      "GroupGrove · Atölye grup planı",
      `Katılımcı: ${plan.participants} | Grup: ${plan.groups}`,
      `Her grup: ${plan.minimum}–${plan.maximum} kişi`,
      `Dağılım (grup sayısı × kişi): ${parts.join(" + ")}`,
      `Uygun grup sayısı: ${plan.firstFeasible}–${plan.lastFeasible}`,
      "Grup sayısı seçilmezse en az sayıda grup kullanılır. Büyüklük farkı en çok 1 kişidir.",
      "Bu sayısal bir plandır; kişileri gruplara atamaz. Erişilebilirlik ve katılım tercihlerini birlikte kararlaştırın.",
    ].join("\n");
  }
  return [
    "GroupGrove · Workshop group plan",
    `Participants: ${plan.participants} | Groups: ${plan.groups}`,
    `Each group: ${plan.minimum}–${plan.maximum} people`,
    `Distribution (groups × people): ${parts.join(" + ")}`,
    `Feasible group counts: ${plan.firstFeasible}–${plan.lastFeasible}`,
    "Without a chosen group count, the fewest groups are used. Sizes differ by at most 1 person.",
    "This numeric plan does not assign people. Agree on accessibility and participation preferences together.",
  ].join("\n");
}
