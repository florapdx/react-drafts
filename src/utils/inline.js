import { ALIGN_STYLES } from '../constants/toolbar';

export function isTextAlignStyle(style) {
  return ALIGN_STYLES.indexOf(style) >= 0;
}

export function getCurrentTextAlignStyle(currentStyles) {
  return ALIGN_STYLES.find(style => currentStyles.has(style));
}

/*
 * We currently support text-align only.
 * Expect these methods to change to support future custom style
 * additions.
 */
export function isCustomStyle(style) {
  return isTextAlignStyle(style);
}

export function getCurrentCustomStyles(currentStyles) {
  const matches = [];

  ALIGN_STYLES.forEach(style => {
    if (currentStyles.has(style)) {
      matches.push(style);
    }
  });

  return matches;
}

export function isVariableStyle(style) {
  return isTextAlignStyle(style);
}

export function getCurrentVariableStyle(currentStyles) {
  return getCurrentTextAlignStyle(currentStyles);
}

