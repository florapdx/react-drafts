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
import blockRenderer from '../../renderer';
import {
  getNewStateWithEntity,
  getEntityDataFromBlock
} from '../../utils/content';
import {
  getCurrentSelection,
  getSelectionInlineStyles
} from '../../utils/selection';
import {
  getControls,
  getCustomStylesMap,
  TOOLBAR_DEFAULTS
} from '../../utils/toolbar';
import Toolbar from '../ToolBar';
import LinkInput from '../ToolBar/link-input';
import PhotoInput from '../ToolBar/photo-input';
import VideoInput from '../ToolBar/video-input';

/*
 * ContentEditor.
 * Renders a WYSIWG editor and toolbar.
 * Content is converted on its way out to html, and back to
 * DraftJS editorState on the way back in (on load, on save, etc).
 */
class ContentEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      showLinkInput: false,
      showPhotoInput: false,
      showVideoInput: false
    };

    this.toolbarControls = getControls(this.props.customControls);
    this.customStyles = getCustomStylesMap(this.toolbarControls);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.focusEditor = this.focusEditor.bind(this);

    this.handleToggleStyle = this.handleToggleStyle.bind(this);
    this.handleToggleBlockType = this.handleToggleBlockType.bind(this);
    this.handleToggleCustomBlockType = this.handleToggleCustomBlockType.bind(this);

    this.handleAddLink = this.handleAddLink.bind(this);
    this.handleEmbedMedia = this.handleEmbedMedia.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    this.renderBlock = this.renderBlock.bind(this);
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

  // https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html
  handleKeyCommand(commandName) {
    const { editorState } = this.state;
    const nextState = RichUtils.handleKeyCommand(editorState, commandName);

    if (nextState) {
      this.handleChange(nextState);
      return 'handled'; // true
    }

    return 'not handled'; // false
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

  handleToggleCustomBlockType(blockType) {
    let nextState;

    switch(blockType) {
      case 'LINK':
        nextState = { showLinkInput: true };
        break;
      case 'photo':
        nextState = { showPhotoInput: true };
        break;
      case 'video':
        nextState = { showVideoInput: true };
        break;
      default:
        return;
    }

    this.setState(nextState);
  }

  handleAddLink(link) {
    const { editorState } = this.state;
    const newEditorState = getNewStateWithEntity(
      editorState,
      TOOLBAR_DEFAULTS.link.id,
      true,
      link
    );

    this.setState({
      editorState: RichUtils.toggleLink(...newEditorState),
      showLinkInput: false
    }, this.focusEditor);
  }

  handleEmbedMedia(blockType, media) {
    const { editorState } = this.state;
    const newEditorState = getNewStateWithEntity(
      editorState,
      TOOLBAR_DEFAULTS[blockType].id,
      false,
      media
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        newEditorState.entityKey,
        ' '
      ),
      showPhotoInput: false,
      showVideoInput: false
    });
  }

  handleModalClose() {
    this.setState({
      showLinkInput: false,
      showPhotoInput: false,
      showVideoInput: false
    });
  }

  renderBlock(block) {
    const { editorState } = this.state;

    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entityData = getEntityDataFromBlock(block, contentState);
      blockRenderer(entityData);
    }
  }

  render() {
    const {
      editorState,
      showLinkInput,
      showPhotoInput,
      showVideoInput
    } = this.state;

    const extendedRenderMap = DefaultDraftBlockRenderMap.merge(Immutable.Map({
      'photo': { element: 'div' },
      'video': { element: 'div' }
    }));

    // Hide placeholder if editor is content-free
    const contentState = editorState.getCurrentContent();
    const rootClassName = !contentState.hasText() &&
      contentState.getBlockMap().first().getType() !== 'unstyled' ?
      'csfd-editor-root no-placeholder' : 'csfd-editor-root';

    return (
      <div className={rootClassName}>
        <Toolbar
          editorState={editorState}
          toolbarControls={this.toolbarControls}
          onToggleStyle={this.handleToggleStyle}
          onToggleBlockType={this.handleToggleBlockType}
          onToggleCustomBlockType={this.handleToggleCustomBlockType}
        />
        <Editor
          refs={editor => this.editor = editor}
          editorState={editorState}
          placeholder={this.props.placeholder || 'Enter text here...'}
          customStyleMap={this.customStyles}
          blockRenderMap={extendedRenderMap}
          blockRendererFn={this.renderBlock}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
          spellCheck={true}
        />
        {showLinkInput && <LinkInput onAddLink={this.handleAddLink} onCloseClick={this.handleModalClose} />}
        {showPhotoInput && <PhotoInput onAddPhoto={this.handleEmbedMedia} onCloseClick={this.handleModalClose} />}
        {showVideoInput && <VideoInput onAddVideo={this.handleEmbedMedia} onCloseClick={this.handleModalClose} />}
      </div>
    );
  }
}

ContentEditor.propTypes = {
  placeholder: PropTypes.string,
  customControls: PropTypes.shape({})
};

export default ContentEditor;
