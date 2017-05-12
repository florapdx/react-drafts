import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  Modifier,
  convertToRaw
} from 'draft-js';

import { setNewEditorState } from '../../utils/editor';
import { convertToHTML } from '../../utils/export-to-html';

import {
  getContentState,
  getCurrentInlineStyle,
  getNewEntityKey,
  getEntityFromBlock,
  getEntityTypeFromBlock,
  getEntityDataFromBlock,
  updateEntity
} from '../../utils/content';
import {
  getSelectionState,
  getSelectedText,
  getSelectedAtomicBlock,
  getSelectedBlockType,
  getSelectionInlineStyles
} from '../../utils/selection';
import {
  getControls,
  getCustomStylesMap
} from '../../utils/toolbar';
import {
  isVariableStyle,
  getCurrentVariableStyle
} from '../../utils/inline';
import { TAB_SPACES } from '../../constants/keyboard';

import { blockRenderer } from '../../renderer';

import Toolbar from '../Toolbar';
import LinkInput from '../Toolbar/inputs/link';
import TableInput from '../Toolbar/inputs/table';
import PhotoInput from '../Toolbar/inputs/photo';
import RichInput from '../Toolbar/inputs/rich';
import DocumentInput from '../Toolbar/inputs/document';

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
      showTableInput: false,
      showPhotoInput: false,
      showRichInput: false,
      showFileInput: false,
      currentSelectedEntity: null,
      detachToolbar: false,
      isSaving: false
    };

    // public methods
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);

    this.handleChange = this._handleChange.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.handleTab = this._handleTab.bind(this);

    this.toolbarHeight = 0;
    this.handleToolbarDetach = this._handleToolbarDetach.bind(this);

    this.handleToggleStyle = this._handleToggleStyle.bind(this);
    this.handleToggleStyleVariant = this._handleToggleStyleVariant.bind(this);
    this.handleToggleBlockType = this._handleToggleBlockType.bind(this);
    this.handleToggleCustomBlockType = this._handleToggleCustomBlockType.bind(this);
    this.toggleDivider = this._toggleDivider.bind(this);

    this.handleAddLink = this._handleAddLink.bind(this);
    this.insertCollapsedLink = this._insertCollapsedLink.bind(this);
    this.insertSpaceAfter = this._insertSpaceAfter.bind(this);

    this.handleAddTable = this._handleAddTable.bind(this);
    this.handleEmbedMedia = this._handleEmbedMedia.bind(this);
    this.handleModalClose = this._handleModalClose.bind(this);
    this.updateEditorStateWithEntityChange = this._updateEditorStateWithEntityChange.bind(this);

    this.renderBlock = this._renderBlock.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.detachToolbarOnScroll) {
      this.toolbarHeight = document.querySelector('.content-editor__toolbar')
        .clientHeight;
      window.addEventListener('scroll', this.handleToolbarDetach);
    }
  }

  componentWillUnmount() {
    if (this.props.detachToolbarOnScroll) {
      window.removeEventListener('scroll', this.handleToolbarDetach);
    }
  }

  /*
   * Reset editor state with any new content that might be coming in
   * from server.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.props.content) {
      this.handleChange(
        setNewEditorState(
          {
            ...this.props,
            ...nextProps
          },
          this.toolbarControls
        )
      );
    }
  }

  /*
   ** Public method.
   ** Returns promise.
   * The setTimeout w/0 value looks odd, but this is a DraftJS convention.
   * See https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#delayed-state-updates
   */
  focus() {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.editor.focus(), 0);
      resolve();
    });
  }

  blur() {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.refs.editor.blur(), 0);
      resolve();
    });
  }

  /*
   ** Public method.
   ** Returns promise.
   * Convert editor state to specified format.
   * Resolves with content or rejects with error message.
   */
  save() {
    const { exportTo } = this.props;
    const { editorState } = this.state;
    const contentState = getContentState(editorState);

    return new Promise((resolve, reject) => {
      let content;
      let errorMsg = 'There was an error parsing editor content to';

      if (exportTo === 'html') {
        content = convertToHTML(contentState, this.toolbarControls);
        errorMsg = `${errorMsg} html.`;
      } else {
        content = JSON.stringify(convertToRaw(contentState));
        errorMsg = `${errorMsg} raw.`;
      }

      if (content) {
        resolve(content);
      } else {
        reject(errorMsg);
      }
    });
  }

  /*
   ** Public method.
   ** Returns promise.
   * Clear the editor and reset state.
   */
  clear() {
    return new Promise((resolve, reject) => {
      this.setState({
        editorState: setNewEditorState({}, this.toolbarControls),
        showLinkInput: false,
        showTableInput: false,
        showPhotoInput: false,
        showRichInput: false,
        showFileInput: false,
        isSaving: false
      }, () => {
        resolve();
      });
    });
  }

  _handleChange(editorState) {
    this.setState({ editorState });
  }

  // https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html
  // https://draftjs.org/docs/api-reference-editor.html#cancelable-handlers-optional
  _handleKeyCommand(commandName) {
    const { editorState } = this.state;
    const nextState = RichUtils.handleKeyCommand(editorState, commandName);

    if (nextState) {
      this.handleChange(nextState);
      return 'handled';
    }

    return 'not handled';
  }

  _handleTab(event) {
    this.handleChange(
      RichUtils.onTab(
        event,
        this.state.editorState,
        TAB_SPACES
      )
    );
  }

  _handleToolbarDetach() {
    const { detachToolbar } = this.state;
    const editorRect = document.querySelector('.content-editor')
      .getBoundingClientRect();

    if (editorRect.top < 0 && editorRect.bottom > this.toolbarHeight) {
      this.setState({ detachToolbar: true });
    } else if (detachToolbar) {
      this.setState({ detachToolbar: false });
    }
  }

  _insertSpaceAfter() {
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

  _handleToggleStyle(style) {
    const { editorState } = this.state;
    const currentStyles = getCurrentInlineStyle(editorState);
    const currentVariableStyle = getCurrentVariableStyle(currentStyles);

    if (currentVariableStyle && isVariableStyle(style)) {
      this.handleToggleStyleVariant(currentVariableStyle, style);
    } else {
      this.handleChange(
        RichUtils.toggleInlineStyle(
          this.state.editorState,
          style
        )
      );
    }
  }

  /*
   * This method applies to the only variable style we currently support:
   * `text-align`. This may change if we decide to add other custom styles
   * that have more than one supported value option.
   * Since DraftJS tracks styles via a map of style ids ('BOLD', 'align-right', etc),
   * it is naive with respect to the style property on nodes and has no
   * internal mechanism for removing styles from the map that represent
   * alternative values for the same node. While this doesn't affect the
   * rendering of nodes themselves, it does affect active states within
   * the Toolbar, so we'll go ahead and remove pre-existing values here.
   */
  _handleToggleStyleVariant(currentStyle, newStyle) {
    const { editorState } = this.state;

    const newContentState = Modifier.removeInlineStyle(
      getContentState(editorState),
      getSelectionState(editorState),
      currentStyle
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-inline-style'
    );

    this.handleChange(
      RichUtils.toggleInlineStyle(
        newEditorState,
        newStyle
      )
    );
  }

  _handleToggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  /*
   * Show active embed input (unless divider).
   * Ensures only one can be active at a time.
   * @TODO: It might be nice to find a more succinct way
   * to do this re: separate state for each input type,
   * particularly if we add any more. In fact, we might
   * have to rethink this a little for customControlProps.
   */
  _handleToggleCustomBlockType(blockType) {
    const { editorState } = this.state;
    const { link, table, photo, rich, file, divider } = this.toolbarControls;

    if (blockType === divider.id) {
      this.toggleDivider(blockType);
      return;
    }

    // If user is toggling link, we don't want to show the link input,
    // we just want to toggle the selection to un-linkify it.
    if (blockType === link.id) {
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

    const nextState = {
      showLinkInput: false,
      showTableInput: false,
      showPhotoInput: false,
      showRichInput: false,
      showFileInput: false,
      currentSelectedEntity: null
    };

    switch(blockType) {
      case link.id:
        nextState.showLinkInput = true;
        break;
      case table.id:
        nextState.showTableInput = true;
        break;
      case photo.id:
        nextState.showPhotoInput = true;
        break;
      case rich.id:
        nextState.showRichInput = true;
        break;
      case file.id:
        nextState.showFileInput = true;
        break;
      default:
        return;
    }

    const selectedBlock = getSelectedAtomicBlock(editorState);
    const entity = selectedBlock.getType() === 'atomic' ?
      getEntityFromBlock(selectedBlock, getContentState(editorState)) : null;

    if (entity && entity.getType() === blockType) {
      nextState.currentSelectedEntity = {
        entityKey: selectedBlock.getEntityAt(0),
        entity
      };
    }

    this.setState(nextState);
  }

  _toggleDivider(blockType) {
    const { editorState } = this.state;
    const entityKey = getNewEntityKey(
      editorState,
      blockType,
      false
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      )
    });
  }

  _handleAddLink(blockType, link) {
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
  _insertCollapsedLink(editorState, selection, entityKey, linkText) {
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

  _updateEditorStateWithEntityChange(editorState, entityKey, newEntityData) {
    const nextContentState = updateEntity(
      getContentState(editorState),
      entityKey,
      { ...newEntityData }
    );

    const nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'apply-entity'
    );

    return EditorState.forceSelection(
      nextEditorState,
      getSelectionState(editorState)
    );
  }

  _handleAddTable(blockType, existingEntity, data) {
    const { editorState } = this.state;
    let nextEditorState;

    if (existingEntity) {
      nextEditorState = this.updateEditorStateWithEntityChange(
        editorState,
        existingEntity.entityKey,
        data
      );
    } else {
      const entityKey = getNewEntityKey(
        editorState,
        blockType,
        false,
        data
      );

      nextEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      );
    }

    this.setState({
      editorState: nextEditorState,
      showTableInput: false
    });
  }

  _handleEmbedMedia(blockType, existingEntity, media) {
    const { editorState } = this.state;

    let nextEditorState;
    if (existingEntity) {
      nextEditorState = this.updateEditorStateWithEntityChange(
        editorState,
        existingEntity.entityKey,
        media
      );
    } else {
      const entityKey = getNewEntityKey(
        editorState,
        blockType,
        false,
        media
      );

      nextEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      );
    }

    this.setState({
      editorState: nextEditorState,
      showFileInput: false,
      showPhotoInput: false,
      showRichInput: false
    });
  }

  _handleModalClose() {
    this.setState({
      showLinkInput: false,
      showTableInput: false,
      showPhotoInput: false,
      showRichInput: false,
      showFileInput: false
    });
  }

  _renderBlock(block) {
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
      showTableInput,
      showPhotoInput,
      showRichInput,
      showFileInput,
      currentSelectedEntity,
      detachToolbar
    } = this.state;

    const {
      placeholder,
      onFileUpload,
      onFocus,
      onBlur,
      maxImgWidth,
      allowPhotoSizeAdjust,
      allowPhotoLink,
      linkInputAcceptsFiles,
      spellcheckEnabled
    } = this.props;
    const { toolbarControls } = this;

    // Hide placeholder if editor is content-free
    const contentState = getContentState(editorState);
    const rootClassName = !contentState.hasText() &&
      contentState.getBlockMap().first().getType() !== 'unstyled' ?
      'content-editor no-placeholder' : 'content-editor';

    return (
      <div className={rootClassName} onFocus={onFocus} onBlur={onBlur}>
        <Toolbar
          editorState={editorState}
          toolbarControls={toolbarControls}
          onToggleStyle={this.handleToggleStyle}
          onToggleBlockType={this.handleToggleBlockType}
          onToggleCustomBlockType={this.handleToggleCustomBlockType}
          detachToolbar={detachToolbar}
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
          spellCheck={spellcheckEnabled}
        />
        {
          showLinkInput &&
            <LinkInput
              blockType={toolbarControls.link.id}
              currentEntity={currentSelectedEntity}
              linkText={getSelectedText(editorState)}
              linkInputAcceptsFiles={linkInputAcceptsFiles}
              onFileUpload={onFileUpload}
              onAddLink={this.handleAddLink}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showTableInput &&
            <TableInput
              blockType={toolbarControls.table.id}
              currentEntity={currentSelectedEntity}
              onAddTable={this.handleAddTable}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showPhotoInput &&
            <PhotoInput
              blockType={toolbarControls.photo.id}
              currentEntity={currentSelectedEntity}
              allowPhotoLink={allowPhotoLink}
              allowPhotoSizeAdjust={allowPhotoSizeAdjust}
              maxImgWidth={maxImgWidth}
              onFileUpload={onFileUpload}
              onAddPhoto={this.handleEmbedMedia}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showRichInput &&
            <RichInput
              blockType={toolbarControls.rich.id}
              currentEntity={currentSelectedEntity}
              onAddRichMedia={this.handleEmbedMedia}
              onCloseClick={this.handleModalClose}
            />
        }
        {
          showFileInput &&
            <DocumentInput
              blockType={toolbarControls.file.id}
              currentEntity={currentSelectedEntity}
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
  placeholder: 'Enter text here...',
  spellcheckEnabled: true,
  customControls: [],
  detachToolbarOnScroll: true,
  onFocus: () => {},
  onBlur: () => {},
  linkInputAcceptsFiles: false
};

ContentEditor.propTypes = {
  content: PropTypes.string,
  placeholder: PropTypes.string,
  spellcheckEnabled: PropTypes.bool,
  customControls: PropTypes.arrayOf(PropTypes.string),
  detachToolbarOnScroll: PropTypes.bool,
  allowPhotoLink: PropTypes.bool,
  allowPhotoSizeAdjust: PropTypes.bool,
  maxImgWidth: PropTypes.number,
  linkInputAcceptsFiles: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onFileUpload: PropTypes.func.isRequired,
  exportTo: PropTypes.oneOf(['html', 'raw']).isRequired
};

export default ContentEditor;
