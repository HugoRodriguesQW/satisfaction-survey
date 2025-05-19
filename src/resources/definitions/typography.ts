export const FontFamily = ["sans", "serif", "mono"] as const;

export const FontWeight = [
  //  "thin", // 100
  //  "extralight", // 200
  "light", // 300
  "normal", // 400
  //  "medium", // 500
  "semibold", // 600
  "bold", // 700
  //  "extrabold", // 800
  //  "black", // 900
] as const;

export type FontWeight = (typeof FontWeight)[number];
export type FontFamily = (typeof FontFamily)[number];
