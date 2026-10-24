// Non-text data for the product categories. All visible text (names, descriptions,
// sizes, packing...) lives in messages/<locale>.json under "categories.<id>".
export const CATEGORIES = [
  { id: "edible-salt", img: "edible-salt.jpg", pos: "50% 55%", en: "Edible Pink Himalayan Salt" },
  { id: "culinary-salt", img: "culinary-salt.jpg", pos: "50% 60%", en: "Cooking Plates & Culinary" },
  { id: "salt-lamps", img: "salt-lamps.jpg", pos: "50% 62%", en: "Pink Himalayan Salt Lamps" },
  { id: "candle-holders", img: "candle-holders.jpg", pos: "50% 55%", en: "Salt Candle Holders" },
  { id: "bath-salt", img: "bath-salt.jpg", pos: "50% 60%", en: "Bath & Spa Salt" },
  { id: "salt-tiles", img: "salt-tiles.jpg", pos: "40% 50%", en: "Salt Bricks & Tiles" },
  { id: "lick-salt", img: "animal-lick-rope.jpg", pos: "45% 55%", en: "Animal Lick Salt" },
  { id: "salt-therapy", img: "salt-therapy.jpg", pos: "50% 50%", en: "Salt Therapy (Halotherapy)" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category["id"];

/** Extra choices in the quote form's product dropdown (besides the categories). */
export const EXTRA_PRODUCT_OPTIONS = [
  { id: "private-label", key: "optionPrivateLabel", en: "Private label / OEM" },
  { id: "mixed", key: "optionMixed", en: "Mixed container" },
  { id: "other", key: "optionOther", en: "Other" },
] as const;

export type TitleText = { title: string; text: string };
