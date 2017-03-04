import React, { PropTypes, Component } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier
} from 'draft-js';
import {
  getCurrentSelection,
  getSelectionInlineStyles
} from '../../utils/selection';
import {
  getControls,
  getCustomStylesMap
} from '../../utils/toolbar';
import Toolbar from '../Toolbar';

/*
 * ContentEditor.
 * Renders a WYSIWG editor and toolbar.
 * Content is converted on its way out to html, and back to
 * DraftJS editorState on the way back in (on load, on save, etc).
 */
class ContentEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.toolbarControls = getControls(this.props.customControls);
    this.customStyles = getCustomStylesMap(this.toolbarControls);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    this.handleToggleStyle = this.handleToggleStyle.bind(this);
    this.handleToggleBlockType = this.handleToggleBlockType.bind(this);
    this.handleToggleCustomBlockType = this.handleToggleCustomBlockType.bind(this);
  }

  handleChange(editorState) {
    this.setState({ editorState });
  }

  // https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html
  handleKeyCommand(commandName) {
    const { editorState } = this.state;
    const nextState = RichUtils.handleKeyCommand(editorState, commandName);

    if (nextState) {
      this.handleChange(nextState);
      return 'handled'; // true
    }

    return 'not handled'; // false
  }

  handleToggleStyle(style) {
    this.handleChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        style
      )
    );
  }

  handleToggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  handleToggleCustomBlockType(blockType) {

  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="csfd-editor-root">
        <Toolbar
          editorState={editorState}
          toolbarControls={this.toolbarControls}
          onToggleStyle={this.handleToggleStyle}
          onToggleBlockType={this.handleToggleBlockType}
          onToggleCustomBlockType={this.handleToggleCustomBlockType}
        />
        <Editor
          editorState={editorState}
          customStyleMap={this.customStyles}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
        />
      </div>
    );
  }
}

ContentEditor.propTypes = {
  customControls: PropTypes.shape({})
};

export default ContentEditor;
