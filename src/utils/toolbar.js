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
 * versus TOOLBAR_DEFAULTS so that any custom controls will be counted.
 */

export function getControls(customControls) {
  customControls = customControls || {};
  let defaults = { ...TOOLBAR_DEFAULTS };

  // Merge deep
  if (customControls.embedOptions) {
    defaults = {
      ...defaults,
      embed: {
        ...defaults.embed,
        options: [
          ...defaults.embed.options,
          ...customControls.embedOptions
        ]
      }
    };
  }
  return { ...defaults, ...customControls };
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
