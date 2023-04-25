/**
 * 改造カードを順番毎に適用 同グループの効果は後のだけ適応
 */
export function mergeModEffect(cards: ModCard[]) {
  const result: Record<string, string | string[]> = {};
  const totals: Record<string, number> = {};

  for (const card of cards) {
    for (const effect of card.effects) {
      // mutateするタイプならいい感じに計算しようと思ったけどめんどいので後日やる
      if (effect.mutate !== undefined) {
        if (!result[effect.group]) {
          result[effect.group] = [];
          totals[effect.group] = 0;
        }
        // @ts-ignore
        result[effect.group].push(effect.name);
        totals[effect.group] += effect.mutate;
      } else {
        result[effect.group] = effect.name;
      }
    }
  }
  const ret: string[] = [];
  Object.entries(result).forEach(([_, v]) => {
    if (Array.isArray(v)) {
      ret.push(...v);
    } else {
      ret.push(v);
    }
  });

  const numbers: string[] = [];
  Object.entries(totals).forEach(([k, v]) => {
    // @ts-ignore
    const trueKey = dictionary[k] ?? "この文字列出たらエラーだから教えて";
    numbers.push(`${trueKey} ${v > 0 ? "+" : ""}${v}`);
  });
  return [ret, numbers];
}

const dictionary = {
  hp: "HP",
  hpr: "HP(%)",
  attack: "アタック",
  charge: "チャージ",
  rapid: "ラピッド",
  custom: "カスタム",
  mega: "メガフォルダ",
  giga: "ギガフォルダ",
};
