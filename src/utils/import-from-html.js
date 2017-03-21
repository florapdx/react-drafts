import { convertFromHTML as convert } from 'draft-convert';
import { getNewEntityKey } from './content';

function getCaptionData(node) {
  const captionNode = node.parentNode.children[1];
  if (captionNode) {
    return captionNode.innerText || '';
  }
}

function getPhotoData(node) {
  return {
    src: node.src,
    caption: getCaptionData(node)
  };
}

function getVideoData(node) {
  // pass parentNode due to wrapper div
  return {
    src: node.src,
    caption: getCaptionData(node.parentNode)
  };
}

function getDocumentData(node) {
  return {
    src: node.src,
    name: node.download,
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
        data = { url: node.href, text: node.alt };
      }
      break;
    case 'img':
      type = configs.photo.id;
      mutability = 'IMMUTABLE';
      data = getPhotoData(node);
      break;
    case 'iframe':
      type = configs.video.id,
      mutability = 'IMMUTABLE';
      data = getVideoData(node);
      break;
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

export function convertFromHTML(contentState, html, toolbarConfigs) {
  return convert({
    htmlToEntity: (nodeName, node) =>
      convertToEntity(nodeName, node, contentState, toolbarConfigs),
    htmlToBlock: convertToBlock
  })(html);
}
