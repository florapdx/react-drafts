## Content Editor
React WYSIWYG editor component built using DraftJS.


## Use
@TODO: update once published to npm
Packaged per UMD specification.

```
import React, { Component } from 'react';
import { ContentEditor } from '@crossfield/content-editor';

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

See the demo directory for example. Demo contains a sample editor parent container that instantiates the `ContentEditor` component and passes in props.


## Public methods
_focus_: Focus the editor.

_save_: Save content to whatever format is specified in the `exportTo` prop (see below). Returns a promise, and resolves with content or error message if an error is thrown.

_clear_: Clear content from the editor. Returns a promise.


## Props
_content_: { string } :: HTML or raw content

_placeholder_: { string } :: Editor placeholder message

_spellcheckEnabled_: { bool } :: Enable browser spellcheck (behavior is dependent on user settings)

_customControls_: { object } :: Custom controls to add to the toolbar. Must adhere to the signature of toolbar constants. Note: this feature is currently experimental, and will likely need additional work to support (particularly anything other than simple inline or block controls).

_detachToolbarOnScroll_: { bool } :: Whether to detach the toolbar on scroll. Fixes to top of viewport for better user experience on longer posts.

_onFocus_: { func } :: Respond to editor focus event.

_onBlur_: { func } :: Respond to editor blur event.

_onFileUpload_: { func, required } :: Respond to file upload event. Hook for saving file to server or cloud service.

_exportTo_: { string, oneOf(['html', 'raw']), required } :: Import/Export format. Raw option exports DraftJS raw format, which can be parsed into markdown or other format.


## Developing and testing
To get started, clone down the repo and ```$ npm install```.

There's a development server that serves a demo project that consists of a parent component that renders the exported `ContentEditor` module.
The server has built-in hot-reloading.
To use, run:

```
$ npm start
```


## Publishing
Steps to publish to npm:
1. Make sure you have group permissions, and log back into npm in your console:
  `npm login --scope=@crossfield --registry=https://registry.npmjs.org/`
2. Bump the version in `package.json` and commit
3. Add a git tag: `$ git tag #.#.#` (please follow semver :)
4. `$ git push origin #.#.#`
5. `$ npm publish`

