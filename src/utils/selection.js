import { getInlineStyleControlsMap } from './toolbar';
/*
 * Selections Utils. A collection of utils for working with selections.
 *
 * About selections:
 * A good thing to understand about selections is that they
 * can be either collapsed (effectively there's no selection-drag, and
 * we're just in a default cursor-state), or not-collapsed (what we normally
 * think of as selected, where there's been a mouse drag over text).
 *
 * See http://draftjs.org/docs/api-reference-selection-state.html#content
 * for doc on selection methods and anchor/offset, start/end paradigms.
 *
 */

export function getSelectionState(editorState) {
  return editorState.getSelection();
}

export function getSelectionAnchorKey(editorState) {
  const currentSelection = getSelectionState(editorState);
  return currentSelection.getAnchorKey();
}

export function getSelectionStartKey(editorState) {
  const currentSelection = getSelectionState(editorState);
  return currentSelection.getStartKey();
}

export function getSelectedBlock(editorState) {
  const currentContent = editorState.getCurrentContent();
  const anchorKey = getSelectionAnchorKey(editorState);

  return currentContent.getBlockForKey(anchorKey);
}

/*
 * Selecting atomic blocks can be tricky from a user standpoint
 * because it's easy to accidentally select the surrounding
 * buffer divs. Not ideal, but as a corrective we'll go ahead and
 * check here to see if the next block is atomic.
 */
export function getSelectedAtomicBlock(editorState) {
  const currentContent = editorState.getCurrentContent();
  const anchorKey = getSelectionAnchorKey(editorState);

  let selectedBlock = currentContent.getBlockForKey(anchorKey);
  if (selectedBlock.getType() === 'unstyled' && selectedBlock.getText() === '') {
    const nextBlock = currentContent.getBlockAfter(anchorKey);

    if (nextBlock && nextBlock.getType() === 'atomic') {
      selectedBlock = nextBlock;
    }
  }

  return selectedBlock;
}

export function getSelectedBlockType(editorState) {
  const block = getSelectedBlock(editorState);
  return block.getType();
}

export function getSelectedBlockText(editorState) {
  const block = getSelectedBlock(editorState);
  return block.getText();
}

export function getSelectedText(editorState) {
  const currentSelection = getSelectionState(editorState);
  const start = currentSelection.getStartOffset();
  const end = currentSelection.getEndOffset();

  const block = getSelectedBlock(editorState);
  return block.getText().slice(start, end);
}

export function getSelectionInlineStyles(editorState) {
  const selectedBlock = getSelectedBlock(editorState);
  const styleMap = getInlineStyleControlsMap();

  selectedBlock.getCharacterList().forEach(char => {
    for (let style in styleMap) {
      if (char.hasStyle(style)) {
        styleMap[style] = true;
      }
    }
  });

  return styleMap;
}
