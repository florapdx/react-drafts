import React, { PropTypes, Component } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import Toolbar from '../Toolbar';
import '../../../node_modules/draft-js/dist/Draft.css';
import styles from './styles.css';

class ContentEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createEmpty() };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
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
      return 'handled';
    }

    return 'not handled';
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="csfd-editor-root">
        <Toolbar />
        <Editor
          editorState={editorState}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
        />
      </div>
    );
  }
}

ContentEditor.propTypes = {};

export default ContentEditor;
