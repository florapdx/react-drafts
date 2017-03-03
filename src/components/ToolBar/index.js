import React, { PropTypes, Component } from 'react';
import { getSelectionStartKey } from '../../utils/selection';
import {
  getControls,
  isMenuContext,
  isBlockType
} from '../../utils/toolbar';
import {
  TYPE_INLINE,
  TYPE_BLOCK,
  TYPE_CUSTOM_INLINE,
  TYPE_CUSTOM_BLOCK
} from '../../constants/toolbar';
import SimpleDropdown from '../shared/simple-dropdown';
import Control from './Control';

function Toolbar(props) {
  function buildControls(controls) {
    return controls.map(control => {
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

      const { editorState } = props;
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
        onToggle = type === TYPE_CUSTOM_INLINE ?
          props.onToggleCustomStyle : props.onToggleStyle;
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

  const controlsList = getControls(props.toolbarControls);
  return (
    <div className="csfd-editor-toolbar" onMouseDown={this.handleMouseDown}>
      <ul className="csfd-editor-toolbar__controls">
        {buildControls(controlsList)}
      </ul>
    </div>
  );
}

Toolbar.propTypes = {
  toolbarControls: PropTypes.shape({}),
  onToggleStyle: PropTypes.func.isRequired,
  onToggleCustomStyle: PropTypes.func.isRequired,
  onToggleBlockType:PropTypes.func.isRequired,
  onToggleCustomBlockType: PropTypes.func.isRequired
};

export default Toolbar;
