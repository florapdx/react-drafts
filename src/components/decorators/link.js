import React, { PropTypes } from 'react';
import { getEntityData, getEntityType } from '../../utils/content';
import Link from '../custom/link';

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

/* Component renderer */
// Clicking a link in the editor will not trigger a navigation
// event in the browser without the `onClick` handler.
function LinkRenderer({ contentState, children, entityKey }) {
  const { url, text } = getEntityData(contentState, entityKey);
  return (
    <Link url={url} text={text}>
      {children}
    </Link>
  );
}

export default {
  strategy: findLinkEntities,
  component: LinkRenderer
};
