// ==========================================================
// フォーム選択肢の定数
// 元: Moodish/index.html の <select>/<radio> 選択肢を移植
// ==========================================================

export const PURPOSE_OPTIONS = [
  "初デート",
  "付き合う前",
  "恋人との普通のデート",
  "誕生日",
  "記念日",
  "ちょっと特別",
  "友達以上恋人未満",
  "その他",
] as const;

export const SCENE_OPTIONS = ["ランチ", "ディナー", "カフェ"] as const;

export const GENRE_OPTIONS = [
  "イタリアン",
  "焼肉",
  "和食",
  "フレンチ",
  "中華",
  "カフェ",
  "その他",
  "特に決めてない",
] as const;

export const SEAT_OPTIONS = ["おまかせ", "カウンター", "テーブル", "半個室", "個室"] as const;

export const SMOKING_OPTIONS = ["こだわらない", "禁煙希望", "喫煙可でもOK"] as const;

export const LOCATION_MODE_OPTIONS = [
  { value: "area", label: "エリア指定" },
  { value: "midpoint", label: "2人の最寄駅から中間地点を提案" },
] as const;
