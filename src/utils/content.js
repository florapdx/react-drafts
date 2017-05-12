/*
 * ContentState helpers.
 * Includes utils to help with entities.
 */

export function getContentState(editorState) {
  return editorState.getCurrentContent();
}

export function getCurrentInlineStyle(editorState) {
  return editorState.getCurrentInlineStyle();
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

export function getNewEntityKey(editorState, blockType, isMutable, options) {
  const contentState = getContentState(editorState);
  const contentWithEntity = contentState.createEntity(
    blockType,
    isMutable ? 'MUTABLE' : 'IMMUTABLE',
    options
  );

  return contentWithEntity.getLastCreatedEntityKey();
}

export function getEntityType(contentState, entityKey) {
  return contentState.getEntity(entityKey).getType();
}

export function getEntityData(contentState, entityKey) {
  return contentState.getEntity(entityKey).getData();
}

export function getEntityFromBlock(block, contentState) {
  const entityKey = block.getEntityAt(0);
  return entityKey ? contentState.getEntity(entityKey) : null;
}

export function getEntityTypeFromBlock(block, contentState) {
  const entity = getEntityFromBlock(block, contentState);
  return entity ? entity.getType() : null;
}

export function getEntityDataFromBlock(block, contentState) {
  const entity = getEntityFromBlock(block, contentState);
  return entity ? entity.getData() : null;
}

export function updateEntity(contentState, entityKey, toMerge) {
  return contentState.mergeEntityData(
    entityKey,
    toMerge
  );
}
