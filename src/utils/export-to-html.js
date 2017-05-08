import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { convertToHTML as convert } from 'draft-convert';
import { isTextAlignStyle } from './inline';
import {
  getContentState,
  getEntityFromBlock
} from './content';

import Link from '../components/custom/link';
import Divider from '../components/custom/divider';
import Table from '../components/custom/table';
import Document from '../components/custom/document';
import Photo from '../components/custom/photo';
import Rich from '../components/custom/rich';

function convertInline(style) {
  // convert toolbar config `align-${value}` to JSX textAlign: ${value}
  if (isTextAlignStyle(style)) {
    return <span style={{ display: 'block', textAlign: style.split('-')[1]}} />;
  }
}

function convertBlock(block, contentState, toolbarConfigs) {
  const { type, key } = block;

  const isEmptyPTag = block => {
    return block.type === 'unstyled' &&
      !block.depth && !block.text;
  };

  let converted;
  if (isEmptyPTag(block)) {
    // convert empty <p> to <br />s anytime we run into two
    // <p>s in a row (double return). This preserves uniformity b/t
    // appearance of content in the editor and rendered html.
    const previousBlock = contentState.getBlockBefore(key);
    if (previousBlock && isEmptyPTag(previousBlock)) {
      converted = {
        start: '<br />',
        end: ''
      };
    }
  } else if (type === 'atomic') {
    // Get DraftJS block from convert block object, then get entity
    // and add entity type as class on the wrapper for external styling.
    const contentBlock = contentState.getBlockForKey(key);
    const entity = getEntityFromBlock(contentBlock, contentState);

    converted = {
      start: entity ? `<figure class="atomic ${entity.getType()}-block">` : '<figure>',
      end: '</figure>'
    };
  }

  return converted || null;
}

function convertEntity(entity, toolbarConfigs) {
  const { data, type } = entity;

  if (data) {
    switch (type) {
      case toolbarConfigs.link.id:
        return renderToStaticMarkup(<Link {...data} />);
      case toolbarConfigs.divider.id:
        return renderToStaticMarkup(<Divider />);
      case toolbarConfigs.table.id:
        return renderToStaticMarkup(<Table {...data} />);
      case toolbarConfigs.file.id:
        return renderToStaticMarkup(<Document {...data} />);
      case toolbarConfigs.photo.id:
        return renderToStaticMarkup(<Photo {...data} />);
      case toolbarConfigs.rich.id:
        return renderToStaticMarkup(<Rich {...data} />);
      default:
        return null;
    }
  }
}

/*
 * Temporary workaround for draft-convert issue around parsing innerText
 * within nested elements in atomic blocks (ie, 'figcaption').
 * Bug causes figcaption innerText to be appended to figure on each
 * successive import, producing multiple instances of the caption text.
 * See https://github.com/HubSpot/draft-convert/issues/55 for updates.
 */
function cleanHTML(html) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, 'text/html');

  parsed.querySelectorAll('.atomic')
    .forEach(figure => {
      debugger;
      if (figure.childNodes.length === 2) {
        // remove erroneously appended figcaption innerText on figure tags
        figure.removeChild(figure.childNodes[1]);
      }
    });

  return parsed.body.innerHTML;
}

export function convertToHTML(contentState, toolbarConfigs) {
  const html = convert({
    styleToHTML: convertInline,
    blockToHTML: block => convertBlock(block, contentState, toolbarConfigs),
    entityToHTML: entity => convertEntity(entity, toolbarConfigs)
  })(contentState);

  return cleanHTML(html);
}
