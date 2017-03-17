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
  if (exportTo === 'html') {
    newContent = convertFromHTML(
      contentState,
      content,
      toolbarConfigs
    );
  } else {
    newContent = convertFromRaw(content);
  }

  return newContent ?
    EditorState.createWithContent(
      newContent,
      decorators
    ) : EditorState.createEmpty(decorators);
}
