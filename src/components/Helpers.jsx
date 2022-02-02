const alpha_upper = Array.from(Array(26)).map((e, i) => i + 65);
const alpha_lower = Array.from(Array(26)).map((e, i) => i + 97);
const alpha = alpha_lower.concat(alpha_upper);

export const cls_keys = { 0: "", 1: " not ", 2: " false ", 3: " right " };

export const alphabet_lower = alpha_lower
  .map((x) => String.fromCharCode(x))
  .concat("å", "ä", "ö");

export const alphabet_upper = alpha_upper
  .map((x) => String.fromCharCode(x))
  .concat("Å", "Ä", "Ö");

export const alphabet = alpha
  .map((x) => String.fromCharCode(x))
  .concat("å", "ä", "ö", "Å", "Ä", "Ö");
