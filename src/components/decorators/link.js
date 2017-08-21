import React from 'react';
import PropTypes from 'prop-types';
import { Entity } from 'draft-js';
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
  let { url, text } = getEntityData(contentState, entityKey);

  // If pasted, link inner text won't be stored in the data object, so we'll
  // grab it here.
  // NOTE: next DraftJS upgrade, migrate to new Editor prop `handlePastedText`.
  if (!text && children && children[0].props.text) {
    text = children[0].props.text;
    Entity.mergeData(entityKey, { text });
  }

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
