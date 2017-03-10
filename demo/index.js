import React from 'react';
import ReactDOM from 'react-dom';
import ContentEditor from '../src';

function loadSavedContent() {
  const saved = localStorage.getItem('myContent');
  return saved || '';
}

function handleSave(html) {
  localStorage.setItem('myContent', html);
  return Promise.resolve();
}

function handleClear() {
  localStorage.removeItem('myContent');
}

ReactDOM.render(
  <ContentEditor
    contentHTML={loadSavedContent()}
    onFileUpload={file => Promise.resolve({src: file.preview, name: file.name})}
    onSave={html => handleSave(html)}
    onClear={handleClear}
  />,
  document.getElementById('app')
);
