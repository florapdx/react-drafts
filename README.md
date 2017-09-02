[![CircleCI](https://circleci.com/gh/crossfield/react-drafts.svg?&style=shield&circle-tokenf783e8fb93595accb6408ae3e9da2ee02c3706e7)](https://circleci.com/gh/crossfield/react-drafts)


## React Drafts

React-based WYSIWYG editor built using DraftJS. Aim is to support the most commonly requested editor features, plus some uncommonly found features like support for tables.

![react-drafts-features](https://user-images.githubusercontent.com/1137259/29945943-19044528-8e58-11e7-869f-ed6f002b47a7.png)

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
| onChange | function | Respond to editor changes (for external previews, etc). | undefined |
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

## Developing and testing
To get started, clone down the repo and ```$ npm install```.

There's a development server that serves a demo project that consists of a parent component that renders the exported `ReactDrafts` module.
The server has built-in hot-reloading.
To use, run:

```
$ npm start
## editor is running at localhost:3000
```

Tests can be run both in node or in the browser:
```
## Node:
$ npm test

## Browser:
$ npm run test:browser
```

## Issues and Contributions

Contributions are welcome! We will be using Github issues to track feature requests and other proposals. Enhancements and bugs will be tagged accordingly.

If you find a bug, please report using the following format:
 ```
 ## What I was trying to do:

 ## Expected behavior:

 ## Actual behavior:

 ## OS/platform, browser and browser version

 ## Reproducible case and/or test (if applicable)

 ```

