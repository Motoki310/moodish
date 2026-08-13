// ==========================================================
// 桜色 x クリスタル(グラスモーフィズム)テーマ
// 元: Moodish/css/style.css の CSS変数を移植
// ==========================================================

export const colors = {
  bg: "#fff6f9",
  primary: "#f6a8c2",
  primaryDark: "#e88aa8",
  primaryDarker: "#d46a8c",
  primaryLight: "#fde3ec",
  accent: "#f7cede",
  text: "#4a3b40",
  textSub: "#8a7378",
  border: "rgba(243, 198, 214, 0.6)",
  white: "#ffffff",
  danger: "#d9607c",

  glassBg: "rgba(255, 255, 255, 0.55)",
  glassBgStrong: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.75)",

  blobTop: "#ffe3ef",
  blobTopMid: "#f6a8c2",
  blobBottom: "#fff0f6",
  blobBottomMid: "#e6a6c9",

  gradientTop: "#fdf1f6",
  gradientMid: "#fff9fb",
  gradientBottom: "#fdf1f6",
};

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
};

export const shadow = {
  soft: {
    shadowColor: "#d67a9b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 3,
  },
  crystal: {
    shadowColor: "#d67a9b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 6,
  },
};

export const fontFamily = {
  base: undefined, // RNのデフォルト(iOS: San Francisco / Android: Roboto)を使用
};
