import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  Modifier,
  DefaultDraftBlockRenderMap
} from 'draft-js';

import {
  setNewEditorState
} from '../../utils/editor';
import {
  convertToHTML
} from '../../utils/export-to-html';
import {
  getContentState,
  getCurrentInlineStyle,
  getNewEntityKey,
  getEntityTypeFromBlock,
  getEntityDataFromBlock
} from '../../utils/content';
import {
  getSelectionState,
  getSelectedText,
  getSelectedBlock,
  getSelectedBlockType,
  getSelectionInlineStyles
} from '../../utils/selection';
import {
  getControls,
  getCustomStylesMap
} from '../../utils/toolbar';
import { TAB_SPACES } from '../../constants/keyboard';

import { blockRenderer } from '../../renderer';

import Toolbar from '../ToolBar';
import LinkInput from '../ToolBar/inputs/link';
import PhotoInput from '../ToolBar/inputs/photo';
import VideoInput from '../ToolBar/inputs/video';
import DocumentInput from '../ToolBar/inputs/document';

/*
 * ContentEditor.
 * Renders a WYSIWG editor and toolbar.
 * Content is converted on its way out to html, and back to
 * DraftJS editorState on the way back in (on load, on save, etc).
 */
class ContentEditor extends Component {
  constructor(props) {
    super(props);

    this.toolbarControls = getControls(this.props.customControls);
    this.customStyles = getCustomStylesMap(this.toolbarControls);
    this.state = {
      editorState: setNewEditorState(props, this.toolbarControls),
      showLinkInput: false,
      showPhotoInput: false,
      showVideoInput: false,
      showFileInput: false,
      isSaving: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClear = this.handleClear.bind(this);

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleTab = this.handleTab.bind(this);
    this.focusEditor = this.focusEditor.bind(this);
    this.insertSpaceAfter = this.insertSpaceAfter.bind(this);

    this.handleToggleStyle = this.handleToggleStyle.bind(this);
    this.handleToggleBlockType = this.handleToggleBlockType.bind(this);
    this.handleToggleCustomBlockType = this.handleToggleCustomBlockType.bind(this);

    this.handleAddLink = this.handleAddLink.bind(this);
    this.insertCollapsedLink = this.insertCollapsedLink.bind(this);
    this.handleEmbedMedia = this.handleEmbedMedia.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    this.renderBlock = this.renderBlock.bind(this);
  }

  /*
   * Reset editor state with any new content that might be coming in
   * from server.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.contentHTML !== this.props.contentHTML) {
      this.handleChange(
        setNewEditorState(this.props, this.toolbarControls)
      );
    }
  }

  /*
   * The setTimeout w/0 value looks odd, but this is a DraftJS convention.
   * See https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#delayed-state-updates
   */
  focusEditor() {
    setTimeout(() => this.refs.editor.focus(), 0);
  }

  handleChange(editorState) {
    this.setState({ editorState });
  }

  /*
   * Convert editor state to html and call `onSave` prop with result.
   */
  handleSave() {
    this.setState({
      isSaving: true
    }, () => {
      const contentState = getContentState(this.state.editorState);
      const html = convertToHTML(contentState, this.toolbarControls);
      this.props.onSave(html).then(() => this.setState({ isSaving: false }));
    });
  }

  /*
   * Clear the editor and reset state.
   */
  handleClear() {
    this.setState({
      editorState: setNewEditorState(),
      showLinkInput: false,
      showPhotoInput: false,
      showVideoInput: false,
      showFileInput: false,
      isSaving: false
    });

    const { onClear } = this.props;
    if (onClear) {
      onClear();
    }
  }

  // https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html
  // https://draftjs.org/docs/api-reference-editor.html#cancelable-handlers-optional
  handleKeyCommand(commandName) {
    const { editorState } = this.state;
    const nextState = RichUtils.handleKeyCommand(editorState, commandName);

    if (nextState) {
      this.handleChange(nextState);
      return 'handled';
    }

    return 'not handled';
  }

  handleTab(event) {
    this.handleChange(
      RichUtils.onTab(
        event,
        this.state.editorState,
        TAB_SPACES
      )
    );
  }

  insertSpaceAfter() {
    const { editorState } = this.state;
    const selection = getSelectionState(editorState);

    const newEditorState = EditorState.forceSelection(
      editorState,
      selection.merge({
        anchorOffset: selection.getEndOffset(),
        focusOffset: selection.getEndOffset()
      })
    );

    const newContentState = Modifier.insertText(
      getContentState(newEditorState),
      selection,
      ' ',
      getCurrentInlineStyle(newEditorState)
    );

    this.handleChange(
      EditorState.push(
        newEditorState,
        newContentState,
        'insert-characters'
      )
    );
  }

  handleToggleStyle(style) {
    this.handleChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        style
      )
    );
  }

  handleToggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  /*
   * Show active embed input.
   * Ensures only one can be active at a time.
   * @TODO: It might be nice to find a more succinct way
   * to do this re: separate state for each input type,
   * particularly if we add any more. In fact, we might
   * have to rethink this a little for customControlProps.
   */
  handleToggleCustomBlockType(blockType) {
    const nextState = {
      showLinkInput: false,
      showPhotoInput: false,
      showVideoInput: false,
      showFileInput: false
    };
    const { link, photo, video, file } = this.toolbarControls;

    // If user is toggling link, we don't want to show the link input,
    // we just want to toggle the selection to un-linkify it.
    if (blockType === link.id) {
      const { editorState } = this.state;
      const selection = getSelectionState(editorState);
      if (
        RichUtils.currentBlockContainsLink(editorState) &&
        !selection.isCollapsed()
      ) {
        this.handleChange(
          RichUtils.toggleLink(
            editorState,
            selection,
            null
          )
        );
        return;
      }
    }

    switch(blockType) {
      case link.id:
        nextState.showLinkInput = true;
        break;
      case photo.id:
        nextState.showPhotoInput = true;
        break;
      case video.id:
        nextState.showVideoInput = true;
        break;
      case file.id:
        nextState.showFileInput = true;
        break;
      default:
        return;
    }

    this.setState(nextState);
  }

  handleAddLink(blockType, link) {
    const { editorState } = this.state;
    const entityKey = getNewEntityKey(
      editorState,
      blockType,
      true,
      link
    );

    const selection = getSelectionState(editorState);
    if (selection.isCollapsed()) {
      // If is inserting a link, rather than linkifying selected text,
      // insert the text into the content state.
      this.insertCollapsedLink(
        editorState,
        selection,
        entityKey,
        link.text
      );
      return;
    }

    this.setState({
      editorState: RichUtils.toggleLink(
        editorState,
        selection,
        entityKey
      ),
      showLinkInput: false
    });
  }

  /*
   * Insert collapsed link, and add a space after so that link
   * does not continue when user begins typing back in the editor.
   */
  insertCollapsedLink(editorState, selection, entityKey, linkText) {
    const newContentState = Modifier.insertText(
      getContentState(editorState),
      selection,
      linkText,
      getCurrentInlineStyle(editorState),
      entityKey
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );

    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        getSelectionState(newEditorState),
        entityKey
      ),
      showLinkInput: false
    }, () => this.insertSpaceAfter());
  }

  handleEmbedMedia(blockType, media) {
    const { editorState } = this.state;
    const entityKey = getNewEntityKey(
      editorState,
      blockType,
      false,
      media
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      ),
      showPhotoInput: false,
      showVideoInput: false,
      showFileInput: false
    });
  }

  handleModalClose() {
    this.setState({
      showLinkInput: false,
      showPhotoInput: false,
      showVideoInput: false,
      showFileInput: false
    });
  }

  renderBlock(block) {
    const { editorState } = this.state;

    if (block.getType() === 'atomic') {
      const contentState = getContentState(editorState);

      return blockRenderer(
        this.toolbarControls,
        getEntityTypeFromBlock(block, contentState),
        getEntityDataFromBlock(block, contentState)
      );
    }
    return null;
  }

  render() {
    const {
      editorState,
      showLinkInput,
      showPhotoInput,
      showVideoInput,
      showFileInput,
      isSaving
    } = this.state;
    const {
      placeholder,
      onFileUpload
    } = this.props;
    const { toolbarControls } = this;

    // Hide placeholder if editor is content-free
    const contentState = getContentState(editorState);
    const rootClassName = !contentState.hasText() &&
      contentState.getBlockMap().first().getType() !== 'unstyled' ?
      'csfd-editor-root no-placeholder' : 'csfd-editor-root';

    return (
      <div className={rootClassName}>
        <div className="csfd-editor__controls">
          <button className="csfd-editor__control clear" onClick={this.handleClear}>Clear</button>
          <button className="csfd-editor__control save" onClick={this.handleSave}>
            { isSaving ? 'Saving' : 'Save' }
          </button>
        </div>
        <Toolbar
          editorState={editorState}
          toolbarControls={toolbarControls}
          onToggleStyle={this.handleToggleStyle}
          onToggleBlockType={this.handleToggleBlockType}
          onToggleCustomBlockType={this.handleToggleCustomBlockType}
        />
        <Editor
          ref={editor => this.editor = editor}
          editorState={editorState}
          placeholder={placeholder}
          customStyleMap={this.customStyles}
          blockRendererFn={this.renderBlock}
          onChange={this.handleChange}
          onTab={this.handleTab}
          handleKeyCommand={this.handleKeyCommand}
          spellCheck={true}
        />
        {
          showLinkInput &&
            <LinkInput
              blockType={toolbarControls.link.id}
              linkText={getSelectedText(editorState)}
              onAddLink={this.handleAddLink}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showPhotoInput &&
            <PhotoInput
              blockType={toolbarControls.photo.id}
              onFileUpload={onFileUpload}
              onAddPhoto={this.handleEmbedMedia}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showVideoInput &&
            <VideoInput
              blockType={toolbarControls.video.id}
              onAddVideo={this.handleEmbedMedia}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showFileInput &&
            <DocumentInput
              blockType={toolbarControls.file.id}
              onFileUpload={onFileUpload}
              onAddDocument={this.handleEmbedMedia}
              onCloseClick={this.handleModalClose}
            />
        }
      </div>
    );
  }
}

ContentEditor.defaultProps = {
  placeholder: 'Enter text here...'
};

ContentEditor.propTypes = {
  contentHTML: PropTypes.string,
  placeholder: PropTypes.string,
  customControls: PropTypes.shape({}),
  onFileUpload: PropTypes.func.isRequired, // must return a promise that responds with the url
  onSave: PropTypes.func.isRequired, // must return a promise for save verification
  onClear: PropTypes.func // convenience hook in case want to respond to clear event
};

export default ContentEditor;
