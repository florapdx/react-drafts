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

import { blockRenderer } from '../../renderer';
import {
  getContentState,
  getNewStateWithEntity,
  getEntityType,
  getEntityData
} from '../../utils/content';
import {
  getSelectionState,
  getSelectedBlock,
  getSelectionInlineStyles
} from '../../utils/selection';
import {
  getControls,
  getCustomStylesMap
} from '../../utils/toolbar';

import Toolbar from '../ToolBar';
import LinkInput from '../ToolBar/inputs/link';
import PhotoInput from '../ToolBar/inputs/photo';
import VideoInput from '../ToolBar/inputs/video';
import DocumentInput from '../Toolbar/inputs/document';

// const findLinkEntities = (contentBlock, callback, contentState) => {
//   contentBlock.findEntityRanges(
//     (character) => {
//       const entityKey = character.getEntity();
//       return entityKey !== null &&
//         contentState.getEntity(entityKey).getType() === 'LINK';
//     },
//     callback
//   );
// };

// const decorator = new CompositeDecorator([
//     {
//       strategy: findLinkEntities,
//       component: Link,
//     },
// ]);

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
      showVideoInput: false,
      showFileInput: false
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
      return 'handled';
    }

    return 'not handled';
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
    const newState = getNewStateWithEntity(
      editorState,
      blockType,
      true,
      link
    );

    this.setState({
      editorState: RichUtils.toggleLink(
        editorState,
        getSelectionState(editorState),
        newState.entityKey
      ),
      showLinkInput: false
    });
  }

  handleEmbedMedia(blockType, media) {
    const { editorState } = this.state;
    const newState = getNewStateWithEntity(
      editorState,
      blockType,
      false,
      media
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        newState.entityKey,
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
        getEntityType(block, contentState),
        getEntityData(block, contentState)
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
      showFileInput
    } = this.state;
    const { onFileUpload } = this.props;
    const { toolbarControls } = this;

    // Hide placeholder if editor is content-free
    const contentState = getContentState(editorState);
    const rootClassName = !contentState.hasText() &&
      contentState.getBlockMap().first().getType() !== 'unstyled' ?
      'csfd-editor-root no-placeholder' : 'csfd-editor-root';

    return (
      <div className={rootClassName}>
        <Toolbar
          editorState={editorState}
          toolbarControls={toolbarControls}
          onToggleStyle={this.handleToggleStyle}
          onToggleBlockType={this.handleToggleBlockType}
          onToggleCustomBlockType={this.handleToggleCustomBlockType}
        />
        <Editor
          refs={editor => this.editor = editor}
          editorState={editorState}
          placeholder={this.props.placeholder || 'Enter text here...'}
          customStyleMap={this.customStyles}
          blockRendererFn={this.renderBlock}
          onChange={this.handleChange}
          handleKeyCommand={this.handleKeyCommand}
          spellCheck={true}
        />
        {
          showLinkInput &&
            <LinkInput
              blockType={toolbarControls.link.id}
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
  onFileUpload: file => Promise.resolve({ src: file.preview }) // for demo only
}

ContentEditor.propTypes = {
  placeholder: PropTypes.string,
  customControls: PropTypes.shape({}),
  onFileUpload: PropTypes.func.isRequired // must return a promise that responds with the url
};

export default ContentEditor;
