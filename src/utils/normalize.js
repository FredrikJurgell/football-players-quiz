// src/utils/normalize.js
export const normalize = str =>
  str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove combining diacritics
    .replace(/[^\x00-\x7F]/g, '') // remove non-ASCII characters
    .toLowerCase()
    .trim();