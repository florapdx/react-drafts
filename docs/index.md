---
layout: default
---

## Feature list:
* __Rich text editing, including__:
  * heading levels,
  * bold,
  * italic,
  * strikethrough,
  * underline,
  * blockquotes,
  * dividers (ie, `<hr>`)
  * text alignment
* __Add links__:
  * select text to decorate with link, or add your own link text
  * smart parsing into "mailto:" link string if email entered
  * add downloadables as links via file-picker or drag-and-drop
  * ability to set target:blank to open in a new tab (rel="noopener noreferrer" added automatically)
* __Add documents__:
  * add documents via file-picker or drag-and-drop
  * give documents captions
  * edit embedded documents by selecting and clicking toolbar table button
* __Add tables__:
  * add tables with variable column and row counts
  * edit embedded tables by selecting and clicking toolbar table button
* __Photo embeds__:
  * add photos via file-picker or drag-and-drop
  * give users the option to set image width and (max)height (inlined styles)
  * give users the option to add photo links, and to open those links in a new tab
  * give photos captions
  * edit embedded photos by selecting and clicking toolbar photo button
* __Rich embeds__:
  * add YouTube videos, SoundCloud audio clips, PayPal "buy now" buttons -- any service that can be embedded via iframe
  * give rich embeds captions
  * edit embedded content by selecting and clicking toolbar rich button (share icon)
* __Import/export__:
  * export to raw (Javascript), or to html for persistence to your render target (blog, website, etc)
  * import from raw or from html back to editorState


## Public methods

| Name | Description |
| --- | --- |
| focus | Focus the editor. |
| save | Save content to whatever format is specified in the `exportTo` prop (see below). Returns a promise, and resolves with content or error message if an error is thrown. |
| clear | Clear content from the editor. Returns a promise. |


## Props

| PropName | Type | Description | Default value |
| --- | --- | --- | --- |
| content | string (html string or stringified JSON for raw) | HTML or raw content | none |
| placeholder | string | Editor placeholder message | 'Enter text here...' |
| spellcheckEnabled | boolean | Enable browser spellcheck (behavior is dependent on user settings) | true |
| customControls | array (of strings) | If you wish to exclude any of the default options, do so by passing an array of the control names that you do wish to include as `customControls` prop. | defaults (see list below) |
| detachToolbarOnScroll | boolean | Whether to detach the toolbar on scroll. Fixes to top of viewport for better user experience on longer posts. | true |
| allowPhotoLink | boolean | Whether to allow users to wrap uploaded photos in links. | false |
| allowPhotoSizeAdjust | boolean | Whether to allow users to adjust the size of uploaded images. | false |
| maxImgWidth | number | Setting this param will not constrain image upload sizes, but will warn users on photo upload that their image is too large and they need to size down below this max size. | none |
| linkInputAcceptsFiles | boolean | If you'd like to give users the option to add downloadable file links inlined, in addition to (or instead of) as block components with optional captions, pass true. | false |
| onFocus | function | Respond to editor focus event. | no-op |
| onBlur | function | Respond to editor blur event. | no-op |
| onFileUpload | function, *required | Respond to file upload event. Hook for saving file to server or cloud service. | none, required |
| exportTo | string ('html' or 'raw'), *required | Import/Export format. Raw option exports DraftJS raw format, which can be parsed into markdown or other format. | none, required |


## Toolbar controls
```
headings
bold
italic
underline
strikethrough
quotes
bulletList
orderedList
alignLeft
alignCenter
alignRight
divider
link
table
file
photo
rich
```

## Installation

`$ npm install react-drafts`


## Use
This package includes a Common module build at `/lib` and a UMD bundle in `/dist`. Most applications will use the Common build by importing `ReactDrafts` as below.

```
## editor parent component
import React, { Component } from 'react';
import ReactDrafts from 'react-drafts';

class MyEditor extends Component {
  ...

  render() {
    return (
      <div>
        <button onClick={this.handleSave}>Save</button>
        <button onClick={this.handleClear}>Clear</button>
        <ReactDrafts
          onFileUpload={this.handleFileUpload}
          exportTo="raw"
        />
      </div>
    );
  }
}
```

To include styles, just import the css file from `/dist`, ie:

```
## manifest.css
@import <path_to>/node_modules/react-drafts/dist/react-drafts.css
```

See the demo directory for a more complete example. Demo contains a sample editor parent container that instantiates the `ReactDrafts` component and passes in props.

