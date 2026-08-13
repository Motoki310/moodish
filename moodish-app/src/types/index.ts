// ==========================================================
// 型定義
// ==========================================================

export type LocationMode = "area" | "midpoint";

export type Scene = "ランチ" | "ディナー" | "カフェ";

export type Seat = "おまかせ" | "カウンター" | "テーブル" | "半個室" | "個室";

export type Smoking = "こだわらない" | "禁煙希望" | "喫煙可でもOK";

export interface Restaurant {
  name: string;
  genre: string;
  area: string;
  budget: string; // 表示用の価格帯文字列 (例: "5,000〜7,000円")
  scene: string[]; // ["ランチ" | "ディナー" | "カフェ", ...]
  seat: string;
  mood: string; // 表示用の雰囲気文字列
  catch: string;
  tags: string[];
}

export interface ProposalSubmission {
  id: string;
  submittedAt: string; // ISO string
  purpose: string;
  locationMode: LocationMode;
  locationText: string;
  area: string;
  station1: string;
  station2: string;
  budgetMin: number;
  budgetMax: number;
  budget: string; // formatted display string
  scene: string;
  datetime: string;
  genre: string;
  seat: string;
  moodCasualSpecial: number;
  moodBrightDark: number;
  moodLivelyQuiet: number;
  moodText: string;
  ngFood: string;
  allergy: string;
  smoking: string;
}

export interface ProposalFormState {
  purpose: string;
  locationMode: LocationMode;
  area: string;
  station1: string;
  station2: string;
  budgetMin: number;
  budgetMax: number;
  scene: string;
  datetime: string;
  genre: string;
  seat: string;
  moodCasualSpecial: number;
  moodBrightDark: number;
  moodLivelyQuiet: number;
  ngFood: string;
  allergy: string;
  smoking: string;
}
