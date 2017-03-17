import React, { PropTypes, Component } from 'react';
import values from 'lodash.values';
import { getSelectionStartKey } from '../../utils/selection';
import {
  isMenuContext,
  isBlockType
} from '../../utils/toolbar';
import { TYPE_CUSTOM_BLOCK } from '../../constants/toolbar';
import SimpleDropdown from '../shared/simple-dropdown';
import Control from './Control';

/*
 * Toolbar component.
 * Takes array of control objects and editor state, and iterates
 * through, handling both button controls and nested in-menu control
 * rendering.
 */
function Toolbar(props) {
  const { editorState, toolbarControls, detachToolbar } = props;

  function buildControls(controls) {
    return values(controls).map(control => {
      const {
        id,
        context,
        type,
        icon,
        label,
        options
      } = control;

      const isMenu = isMenuContext(control);
      const isBlock = isBlockType(control);

      if (isMenu) {
        return (
          <SimpleDropdown
            key={id}
            menuFor={id}
          >
            {buildControls(control.options)}
          </SimpleDropdown>
        );
      }

      let isActive;
      let onToggle;

      if (isBlock) {
        const blockStartKey = getSelectionStartKey(editorState);
        const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(blockStartKey)
          .getType();

        isActive = id === blockType;
        onToggle = type === TYPE_CUSTOM_BLOCK ?
          props.onToggleCustomBlockType : props.onToggleBlockType;
      } else {
        const currentStyle = editorState.getCurrentInlineStyle();

        isActive = currentStyle.has(id);
        onToggle = props.onToggleStyle;
      }

      return (
        <Control
          key={id}
          id={id}
          icon={icon}
          label={label}
          isActive={isActive}
          onToggle={onToggle}
        />
      );
    });
  }

  return (
    <div className={`csfd-editor-toolbar ${detachToolbar && 'detached'}`}>
      <div className="phantom-detached" />
      <ul className="csfd-editor-toolbar__controls">
        {buildControls(toolbarControls)}
      </ul>
    </div>
  );
}

Toolbar.propTypes = {
  editorState: PropTypes.shape({}),
  toolbarControls: PropTypes.shape({}),
  onToggleStyle: PropTypes.func.isRequired,
  onToggleBlockType:PropTypes.func.isRequired,
  onToggleCustomBlockType: PropTypes.func.isRequired,
  detachToolbar: PropTypes.bool
};

export default Toolbar;
