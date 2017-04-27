import React, { Component } from 'react';
import ContentEditor from '../src';

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
        setTimeout(() => {
          this.setState({
            isSaving: false,
            lastSavedAt: date.toLocaleString()
          });
        }, 1000);
      });
    });
  }

  handleClear() {
    localStorage.removeItem('myContent');
    this.contentEditor.clear();
  }

  render() {
    const { isSaving, lastSavedAt } = this.state;
    const storedContent = this.handleLoadSavedContent();

    return (
      <div className="demo-editor">
        <p style={{position: 'absolute', top: '16px', right: '10%', color: '#bebebe'}}>
          {lastSavedAt && `Last saved: ${lastSavedAt || ''}`}
        </p>
        <div className="content-editor__external-controls">
          <button
            className="content-editor__external-control clear"
            onClick={this.handleClear}
          >
            Clear
          </button>
          <button
            className="content-editor__external-control save"
            onClick={this.handleSave}
          >
            { isSaving ? 'Saving' : 'Save' }
          </button>
        </div>
        <ContentEditor
          ref={contentEditor => this.contentEditor = contentEditor}
          content={storedContent}
          onFileUpload={this.handleFileUpload}
          allowPhotoLink={true}
          allowPhotoSizeAdjust={true}
          maxImgWidth={960}
          exportTo="html"
        />
      </div>
    );
  }
}

export default DemoEditor;
