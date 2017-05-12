## Content Editor
React WYSIWYG editor built using DraftJS.

Demo is staged [here](https://stagingeditor-jpmeupmthp.now.sh/).

## Features:
* Rich text editing, including:
  * heading levels,
  * bold,
  * italic,
  * strikethrough,
  * underline,
  * blockquotes,
  * dividers (<hr>s),
  * text alignment
* Add links:
  * select text to decorate with link, or add your own link text
  * smart parsing into "mailto:" link string if email entered
  * add downloadables as links via file-picker or drag-and-drop
  * ability to set target:blank to open in a new tab (rel="noopener noreferrer" added automatically)
* Add documents:
  * add documents via file-picker or drag-and-drop
  * give documents captions
  * edit embedded documents by selecting and clicking toolbar table button
* Add tables:
  * add tables with variable column and row counts
  * edit embedded tables by selecting and clicking toolbar table button
* Photo embeds:
  * add photos via file-picker or drag-and-drop
  * give users the option to set image width and (max)height (inlined styles)
  * give users the option to add photo links, and to open those links in a new tab
  * give photos captions
  * edit embedded photos by selecting and clicking toolbar photo button
* Rich embeds:
  * add YouTube videos, SoundCloud audio clips, PayPal "buy now" buttons -- any service that can be embedded via iframe
  * give rich embeds captions
  * edit embedded content by selecting and clicking toolbar rich button (share icon)
* Import/export:
  * export to raw (Javascript), or to html for persistence to your render target (blog, website, etc)
  * import from raw or from html back to editorState

## Installation
ContentEditor is currently a private package, published under the `@crossfield` scope. As such, you'll need to obtain a crossfield npm token to install the editor in your project, and to build and deploy your project on remote servers.

To install:
`$ NPM_TOKEN=xxxxxxxxx npm install @crossfield/content-editor`

In your project, add an `.npmrc` file and copy/paste the following into it (don't replace the NPM_TOKEN w/actual token):
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```
Then add the `NPM_TOKEN` as an environment variable in your CI and deployment services.


## Use
This package includes a Common module build at `/lib` and a UMD bundle in `/dist`. Most applications will use the Common build by importing `ContentEditor` as below.

```
## editor parent component
import React, { Component } from 'react';
import ContentEditor from '@crossfield/content-editor';

class MyEditor extends Component {
  ...

  render() {
    return (
      <div>
        <button onClick={this.handleSave}>Save</button>
        <button onClick={this.handleClear}>Clear</button>
        <ContentEditor
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
@import <path_to>/node_modules/@crossfield/content-editor/dist/content-editor-styles.css
```

See the demo directory for a more complete example. Demo contains a sample editor parent container that instantiates the `ContentEditor` component and passes in props.


## Public methods
__focus__: Focus the editor.

__save__: Save content to whatever format is specified in the `exportTo` prop (see below). Returns a promise, and resolves with content or error message if an error is thrown.

__clear__: Clear content from the editor. Returns a promise.


## Props
__content__: { string } :: HTML or raw content

__placeholder__: { string } :: Editor placeholder message

__spellcheckEnabled__: { bool } :: Enable browser spellcheck (behavior is dependent on user settings)

__customControls__: { array of string } :: If you wish to exclude any of the default options, do so by passing an array of the control names that you do wish to include as `customControls` prop.
```
## Available options:
headings,
bold,
italic,
underline,
strikethrough,
quotes,
bulletList,
orderedList,
alignLeft,
alignCenter,
alignRight,
divider,
link,
table,
file,
photo,
rich
```

__detachToolbarOnScroll__: { bool } :: Whether to detach the toolbar on scroll. Fixes to top of viewport for better user experience on longer posts.

__allowPhotoLink__: { bool, default: false } :: Whether to allow users to wrap uploaded photos in links.

__allowPhotoSizeAdjust__: { bool, default: false } :: Whether to allow users to adjust the size of uploaded images.

__maxImgWidth__: { number } :: Setting this param will not constrain image upload sizes, but will warn users on photo upload that their image is too large and they need to size down below this max size.

__linkInputAcceptsFiles__: { bool, default: false } :: If you'd like to give users the option to add downloadable file links inlined, in addition to (or instead of) as block components with optional captions, pass true.

__onFocus__: { func } :: Respond to editor focus event.

__onBlur__: { func } :: Respond to editor blur event.

__onFileUpload__: { func, required } :: Respond to file upload event. Hook for saving file to server or cloud service.

__exportTo__: { string, oneOf(['html', 'raw']), required } :: Import/Export format. Raw option exports DraftJS raw format, which can be parsed into markdown or other format.


## Developing and testing
To get started, clone down the repo and ```$ npm install```.

There's a development server that serves a demo project that consists of a parent component that renders the exported `ContentEditor` module.
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


## Publishing
Steps to publish to npm:
1. Make sure you have group permissions, and log back into npm in your console:
  `npm login --scope=@crossfield --registry=https://registry.npmjs.org/`
2. Bump the version in `package.json` and commit
3. Add a git tag: `$ git tag #.#.#` (please follow semver :)
4. `$ git push origin #.#.#`
5. `$ npm publish`

