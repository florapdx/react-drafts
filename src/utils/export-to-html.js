import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { convertToHTML as convert } from 'draft-convert';
import { isTextAlignStyle } from './inline';
import {
  getContentState,
  getEntityFromBlock
} from './content';

import Link from '../components/custom/link';
import Document from '../components/custom/document';
import Photo from '../components/custom/photo';
import Video from '../components/custom/video';

function convertInline(style) {
  // convert toolbar config `align-${value}` to JSX textAlign: ${value}
  if (isTextAlignStyle(style)) {
    return <span style={{ display: 'block', textAlign: style.split('-')[1]}} />;
  }
}

function convertBlock(block) {
  const type = block.type;
  if (type === 'atomic') {
    return {
      start: '<figure>',
      end: '</figure>'
    };
  }
}

function convertEntity(entity, toolbarConfigs) {
  const { data, type } = entity;

  if (data) {
    switch (type) {
      case toolbarConfigs.link.id:
        return renderToStaticMarkup(<Link {...data} />);
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

export function convertToHTML(contentState, toolbarConfigs) {
  return convert({
    styleToHTML: convertInline,
    blockToHTML: convertBlock,
    entityToHTML: entity => convertEntity(entity, toolbarConfigs)
  })(contentState);
}
