import values from 'lodash.values';
import {
  TYPE_INLINE,
  TYPE_CUSTOM_INLINE,
  TYPE_BLOCK,
  TYPE_CUSTOM_BLOCK,
  CONTEXT_MENU,
  TOOLBAR_DEFAULTS
} from '../constants/toolbar';

/*
 * Toolbar utilities.
 * When adding utilities, make sure to operate on the result of `getControls`
 * versus TOOLBAR_DEFAULTS so that we're referencing the right set of controls.
 */

export function getControls(customControls) {
  let controls;
  if (!customControls.length) {
    controls = { ...TOOLBAR_DEFAULTS };
  } else {
    controls = {};
    customControls.forEach(controlName => {
      controls[controlName] = TOOLBAR_DEFAULTS[controlName] || {};
    });
  }

  return controls;
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

export function getInlineStyleControlsMap(toolbarControls) {
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

  keyObjects(toolbarControls);
  return styles;
}

export function getBlockControlsMap(toolbarControls) {
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

  keyObjects(toolbarControls);
  return blocks;
}

export function getCustomStylesMap(toolbarControls) {
  const map = {};
  values(toolbarControls).forEach(ctrl => {
    if (ctrl.type === TYPE_CUSTOM_INLINE) {
      map[ctrl.id] = ctrl.styles;
    }
  });
  return map;
}
