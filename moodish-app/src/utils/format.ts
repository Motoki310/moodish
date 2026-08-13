// ==========================================================
// フォーマット用ユーティリティ
// ==========================================================

export function formatYen(n: number): string {
  return `${n.toLocaleString("ja-JP")}円`;
}

export function formatDate(isoLike: string): string {
  if (!isoLike) return "-";
  const d = new Date(isoLike);
  if (isNaN(d.getTime())) return isoLike;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// 元: Moodish/js/app.js の MOOD_LABELS を移植
export const MOOD_LABELS: Record<string, string[]> = {
  moodCasualSpecial: ["とてもカジュアル", "ややカジュアル", "普通", "やや特別感", "特別感あり"],
  moodBrightDark: ["とても明るい", "やや明るい", "普通", "やや暗め", "落ち着いた暗さ"],
  moodLivelyQuiet: ["とてもにぎやか", "ややにぎやか", "普通", "やや静か", "とても静か"],
};

export function moodTextFromValues(
  casualSpecial: number,
  brightDark: number,
  livelyQuiet: number
): string {
  return [
    MOOD_LABELS.moodCasualSpecial[casualSpecial],
    MOOD_LABELS.moodBrightDark[brightDark],
    MOOD_LABELS.moodLivelyQuiet[livelyQuiet],
  ].join(" / ");
}
