import {
  EditorState,
  ContentState
} from 'draft-js';
import decorators from '../components/decorators';
import { convertFromHTML } from './import-from-html';

export function setNewEditorState(props={}, toolbarConfigs) {
  const { contentHTML } = props;

  let newContent;
  if (contentHTML) {
    const contentState = new ContentState();
    newContent = convertFromHTML(
      contentState,
      contentHTML,
      toolbarConfigs
    );
  }

  return newContent ?
    EditorState.createWithContent(
      newContent,
      decorators
    ) : EditorState.createEmpty(decorators);
}
