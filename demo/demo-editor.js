import React, { Component } from 'react';
import { ContentEditor } from '../src';

class DemoEditor extends Component {
  constructor() {
    super();

    this.state = {
      isSaving: false,
      lastSavedAt: null
    };

    this.handleLoadSavedContent = this.handleLoadSavedContent.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleLoadSavedContent() {
    const saved = localStorage.getItem('myContent');
    return saved || '';
  }

  handleFileUpload(file) {
    return Promise.resolve({
      src: file.preview,
      name: file.name
    });
  }

  handleSave() {
    this.setState({
      isSaving: true
    }, () => {
      this.contentEditor.save().then(content => {
        localStorage.setItem('myContent', content);
        const date = new Date();
        this.setState({
          isSaving: false,
          lastSavedAt: date.toLocaleString()
        });
      });
    });
  }

  handleClear() {
    localStorage.removeItem('myContent');
    this.contentEditor.handleClear();
  }

  render() {
    const { isSaving, lastSavedAt } = this.state;
    const storedContent = this.handleLoadSavedContent();

    return (
      <div className="demo-editor">
        { lastSavedAt && <p>{lastSavedAt}</p> }
        <div className="csfd-editor__controls">
          <button className="csfd-editor__control clear" onClick={this.handleClear}>Clear</button>
          <button className="csfd-editor__control save" onClick={this.handleSave}>
            { isSaving ? 'Saving' : 'Save' }
          </button>
        </div>
        <ContentEditor
          ref={contentEditor => this.contentEditor = contentEditor}
          content={storedContent}
          onFileUpload={this.handleFileUpload}
          exportTo="raw"
        />
      </div>
    );
  }
}

export default DemoEditor;
