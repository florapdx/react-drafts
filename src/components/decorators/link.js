import React, { PropTypes } from 'react';
import { getEntityData, getEntityType } from '../../utils/content';

/* Strategy */
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity();
      return entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK';
    },
    callback
  );
};

/* Component */
// Clicking a link in the editor will not trigger a navigation
// event in the browser without the `onClick` handler.
function Link({ contentState, children, entityKey }) {
  const { url, text } = getEntityData(contentState, entityKey);
  return (
    <a
      href={url}
      alt={text}
      onClick={() => window.open(url, 'blank')}
    >
      {children || text}
    </a>
  );
}

export default {
  strategy: findLinkEntities,
  component: Link
};
