import values from 'lodash.values';
import {
  TYPE_INLINE,
  TYPE_CUSTOM_INLINE,
  TYPE_BLOCK,
  TYPE_CUSTOM_BLOCK,
  CONTEXT_MENU,
  TOOLBAR_DEFAULTS
} from '../constants/toolbar';

export function getControls(customControls) {
  customControls = customControls || {};
  return values({ ...TOOLBAR_DEFAULTS, ...customControls });
}

export function isMenuContext(ctrl) {
  return ctrl.context && ctrl.context === CONTEXT_MENU;
}

export function isInlineStyle(ctrl) {
  return ctrl.type === TYPE_INLINE || ctrl.type === TYPE_CUSTOM_INLINE;
}

export function isBlockType(ctrl) {
  return ctrl.type === TYPE_BLOCK || ctrl.type === TYPE_CUSTOM_BLOCK;
}

export function getInlineStyleControlsMap() {
  const styles = {};

  function keyObjects(controls) {
    values(controls).forEach(ctrl => {
      if (ctrl.options) {
        keyObjects(ctrl.options);
      } else if (isInlineStyle(ctrl)) {
        styles[ctrl.id] = false;
      }
    });
  }

  keyObjects(TOOLBAR_DEFAULTS);
  return styles;
}

export function getBlockControlsMap() {
  const blocks = {};

  function keyObjects(controls) {
    values(controls).forEach(ctrl => {
      if (ctrl.options) {
        keyObjects(ctrl.options);
      } else if (isBlockType(ctrl)) {
        blocks[ctrl.id] = false;
      }
    });
  }

  keyObjects(TOOLBAR_DEFAULTS);
  return blocks;
}
