import { convertFromHTML as convert } from 'draft-convert';
import { getNewEntityKey } from './content';

function getCaptionData(node) {
  const captionNode = node.parentNode.children[1];
  if (captionNode) {
    return captionNode.innerText || '';
  }
}

function getPhotoData(node) {
  const styles = node.getAttribute('style');
  let width;
  let height;

  if (styles) {
    styles.split(';').forEach(style => {
      const parts = style.split(':');

      if (parts[0] === 'width') {
        width = parts[1].split('px')[0];
      } else if (parts[0] === 'height') {
        height = parts[1].split('px')[0];
      }
    });
  }

  let href;
  let target;
  const parent = node.parentElement;
  if (parent.tagName.toLowerCase() === 'a') {
    href = parent.getAttribute('href');
    target = parent.getAttribute('target');
  }

  return {
    src: node.getAttribute('src'),
    caption: getCaptionData(node),
    width,
    height,
    href,
    target
  };
}

function getRichData(node) {
  // pass parentNode due to wrapper div
  return {
    src: node.getAttribute('src'),
    width: node.getAttribute('width'),
    height: node.getAttribute('height'),
    caption: getCaptionData(node.parentNode)
  };
}

function getDocumentData(node) {
  return {
    src: node.getAttribute('href'),
    name: node.getAttribute('download'),
    caption: getCaptionData(node)
  };
}

function convertToEntity(nodeName, node, contentState, configs) {
  let type;
  let mutability;
  let data;

  switch (nodeName) {
    case 'a':
      if (node.className === 'file-name') {
        // Document
        type = configs.file.id;
        mutability = 'IMMUTABLE';
        data = getDocumentData(node);
      } else {
        // regular link
        type = configs.link.id;
        mutability = 'MUTABLE';
        data = {
          url: node.getAttribute('href'),
          text: node.getAttribute('alt'),
          target: node.getAttribute('target')
        };
      }
      break;
    case 'img':
      type = configs.photo.id;
      mutability = 'IMMUTABLE';
      data = getPhotoData(node);
      break;
    case 'iframe':
      type = configs.rich.id;
      mutability = 'IMMUTABLE';
      data = getRichData(node);
      break;
    case 'hr':
      type = configs.divider.id;
      mutability = 'IMMUTABLE';
      data = {};
    default:
      break;
  }

  if (type) {
    const entity = contentState.createEntity(type, mutability, data);
    return entity.getLastCreatedEntityKey();
  }
}

function convertToBlock(nodeName) {
  if (nodeName === 'figure') {
    return 'atomic';
  }
}

function convertToInline(nodeName, node, currentStyle) {
  const style = node.getAttribute('style');

  // convert text-align value "..text-align:${value};"
  // to toolbar config value, `align-${value}`
  if (nodeName === 'span' && style.split('text-align').length > 1) {
    const textAlign = `align-${style.split('text-align:')[1].replace(';', '')}`;
    return currentStyle.add(textAlign);
  }

  return currentStyle;
}

export function convertFromHTML(contentState, html, toolbarConfigs) {
  return convert({
    htmlToStyle: convertToInline,
    htmlToEntity: (nodeName, node) =>
      convertToEntity(nodeName, node, contentState, toolbarConfigs),
    htmlToBlock: convertToBlock
  })(html);
}
