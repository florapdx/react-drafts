import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { stateToHTML } from 'draft-js-export-html';
import {
  getContentState,
  getEntityFromBlock
} from './content';

import Document from '../components/custom/document';
import Photo from '../components/custom/photo';
import Video from '../components/custom/video';

export function convertToHTML(editorState, toolbarConfigs) {
  const contentState = getContentState(editorState);
  const renderer = {
    blockRenderers: {
      atomic: block => {
        const entity = getEntityFromBlock(block, contentState);
        const data = entity.getData();

        if (data) {
          switch (data.type) {
            case toolbarConfigs.file.id:
              return renderToStaticMarkup(<Document {...data} />);
            case toolbarConfigs.photo.id:
              return renderToStaticMarkup(<Photo {...data} />);
            case toolbarConfigs.video.id:
              return renderToStaticMarkup(<Video {...data} />);
            default:
              return null;
          }
        }
      }
    }
  };

  return stateToHTML(contentState, renderer);
}
