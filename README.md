## Content Editor
React WYSIWYG editor component built using DraftJS.

Demo is staged [here](https://stagingeditor-yrmhuegkus.now.sh).

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
This package includes a Common module build at `/lib` and a UMD bundle in `/dist`. Most applications will use the Common build by importing `ContentEditor` as below. To include styles, just import the css file from `/dist`, ie:
```
// manifest.css
@import <path_to>/node_modules/@crossfield/content-editor/dist/content-editor-styles.css
```

```
// editor parent component
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

See the demo directory for a more complete example. Demo contains a sample editor parent container that instantiates the `ContentEditor` component and passes in props.


## Public methods
__focus__: Focus the editor.

__save__: Save content to whatever format is specified in the `exportTo` prop (see below). Returns a promise, and resolves with content or error message if an error is thrown.

__clear__: Clear content from the editor. Returns a promise.


## Props
__content__: { string } :: HTML or raw content

__placeholder__: { string } :: Editor placeholder message

__spellcheckEnabled__: { bool } :: Enable browser spellcheck (behavior is dependent on user settings)

__customControls__: { object } :: Custom controls to add to the toolbar. Must adhere to the signature of toolbar constants. Note: this feature is currently experimental, and will likely need additional work to support (particularly anything other than simple inline or block controls).

__detachToolbarOnScroll__: { bool } :: Whether to detach the toolbar on scroll. Fixes to top of viewport for better user experience on longer posts.

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
// access editor at localhost:3000
```


## Publishing
Steps to publish to npm:
1. Make sure you have group permissions, and log back into npm in your console:
  `npm login --scope=@crossfield --registry=https://registry.npmjs.org/`
2. Bump the version in `package.json` and commit
3. Add a git tag: `$ git tag #.#.#` (please follow semver :)
4. `$ git push origin #.#.#`
5. `$ npm publish`

