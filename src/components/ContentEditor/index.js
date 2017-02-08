import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

class ContentEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createEmpty() };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(editorState) {
    this.setState({ editorState });
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor editorState={editorState} onChange={this.handleChange} />
    );
  }
}

ContentEditor.propTypes = {};

export default ContentEditor;
