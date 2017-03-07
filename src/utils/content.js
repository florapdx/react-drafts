import { EditorState } from 'draft-js';
/*
 * ContentState helpers.
 * Includes utils to help with entities.
 */

export function getContentState(editorState) {
  return editorState.getContentState();
}

/*
 * Takes care of multi-step process for creating new content
 * state when adding a new entity (custom block, etc).
 * Takes the current editorState and new entity data --
 * blockType (`id` in toolbar constants), mutability, optional data --
 * and returns new editorState with entity, selection, and new entity key.
 * These are the arguments to setState required to embed new entities.
 * Ex:
 *   createNewEntity(editorState, 'LINK', true, { url: 'www.foo.com' });
 */

export function getNewStateWithEntity(editorState, blockType, isMutable, options) {
  const contentState = getContentState(editorState);
  const contentWithEntity = contentState.createEntity(
    blockType,
    isMutable ? 'MUTABLE' : 'IMMUTABLE',
    options
  );

  const newEditorState = EditorState.set(
    editorState,
    { currentContent: contentWithEntity }
  );

  return {
    editorState: newEditorState,
    selection: newEditorState.getSelection(),
    entityKey: contentWithEntity.getLastCreatedEntityKey()
  };
}

export function getEntityDataFromBlock(block, contentState) {
  const entityKey = block.getEntityAt(0);
  return entityKey ? contentState.getEntity(entityKey) : null;
}

