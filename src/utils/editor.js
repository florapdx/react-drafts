import {
  EditorState,
  ContentState,
  convertFromRaw
} from 'draft-js';
import decorators from '../components/decorators';
import { convertFromHTML } from './import-from-html';

export function setNewEditorState(props, toolbarConfigs) {
  const { content, exportTo } = props;
  const contentState = new ContentState();

  let newContent;
  if (content && exportTo === 'html') {
    newContent = convertFromHTML(
      contentState,
      content,
      toolbarConfigs
    );
  } else if (content && exportTo === 'raw') {
    newContent = convertFromRaw(JSON.parse(content));
  }

  return newContent ?
    EditorState.createWithContent(
      newContent,
      decorators
    ) : EditorState.createEmpty(decorators);
}
