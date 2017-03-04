/*
 * Toolbar configs.
 *
 * Config shape: {
 *   id: {String} - the id is used to identify the block type and style to the handler,
 *   type: {String} - identifies the block as requiring inline-styles vs specific markup - does not refer to the specific DraftJS block or entity type,
 *   icon: {String || null} - name of font-awesome icon for button, if any; if none, button shows text,
 *   text: {String} - if no icon, button shows text; text also shown on hover-over for icon description
 * }
 *
 * To group in menu, pass an object with a `context: CONTEXT_MENU` field, and
 * an `options` field w/an array of control objects.
 *
 * See following for official DraftJS block/style ids:
 * - https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftBlockRenderMap.js
 * - https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js
 */

// Type constants.
// Types are native to DraftJS unless of a custom type.

export const TYPE_INLINE = 'inline';
export const TYPE_BLOCK = 'block';
export const TYPE_CUSTOM_INLINE = 'custom-inline';
export const TYPE_CUSTOM_BLOCK = 'custom-block';

// Context
export const CONTEXT_MENU = 'menu';

// Headings, Titles

const heading1 = {
  id: 'header-one',
  type: TYPE_BLOCK,
  icon: null,
  label: 'Title'
};

const heading2 = {
  id: 'header-two',
  type: TYPE_BLOCK,
  icon: null,
  label: 'Heading 2'
};

const heading3 = {
  id: 'header-three',
  type: TYPE_BLOCK,
  icon: null,
  label: 'Heading 3'
};

const heading4 = {
  id: 'header-four',
  type: TYPE_BLOCK,
  icon: null,
  label: 'Heading 4'
};

// Text styles

const bold = {
  id: 'BOLD',
  type: TYPE_INLINE,
  icon: 'bold',
  label: 'Bold'
};

const italic = {
  id: 'ITALIC',
  type: TYPE_INLINE,
  icon: 'italic',
  label: 'Italic'
};

const underline = {
  id: 'UNDERLINE',
  type: TYPE_INLINE,
  icon: 'underline',
  label: 'Underline'
};

const strikethrough = {
  id: 'STRIKETHROUGH',
  type: TYPE_INLINE,
  icon: 'strikethrough',
  label: 'Strikethrough'
};

const quotes = {
  id: 'blockquote',
  type: TYPE_BLOCK,
  icon: 'quote-left',
  label: 'Block quote'
};

const bulletList = {
  id: 'unordered-list-item',
  type: TYPE_BLOCK,
  icon: 'list-ul',
  label: 'Bullet list'
};

const orderedList = {
  id: 'ordered-list-item',
  type: TYPE_BLOCK,
  icon: 'list-ol',
  label: 'Ordered list',
};

const alignLeft = {
  id: 'align-left',
  type: TYPE_CUSTOM_INLINE,
  icon: 'align-left',
  label: 'Align left',
  styles: {
    display: 'block',
    textAlign: 'left'
  }
};

const alignCenter = {
  id: 'align-center',
  type: TYPE_CUSTOM_INLINE,
  icon: 'align-center',
  label: 'Align center',
  styles: {
    display: 'block',
    textAlign: 'center'
  }
};

const alignRight = {
  id: 'align-right',
  type: TYPE_CUSTOM_INLINE,
  icon: 'align-right',
  label: 'Align right',
  styles: {
    display: 'block',
    textAlign: 'right'
  }
};

// const table = {
//   id: 'table',
//   type: TYPE_CUSTOM_BLOCK,
//   icon: 'table',
//   label: 'Table'
// };

const link = {
  id: 'LINK',
  type: TYPE_CUSTOM_BLOCK,
  icon: 'link',
  label: null,
  handler: ''
};

const photo = {
  id: 'photo',
  type: TYPE_CUSTOM_BLOCK,
  icon: null,
  label: 'photo'
};

const video = {
  id: 'video',
  type: TYPE_CUSTOM_BLOCK,
  icon: null,
  label: 'video'
};

export const TOOLBAR_DEFAULTS = {
  headings: {
    id: 'headings',
    context: CONTEXT_MENU,
    options: [
      heading1,
      heading2,
      heading3,
      heading4
    ],
    label: 'Headings'
  },
  bold,
  italic,
  underline,
  strikethrough,
  quotes,
  bulletList,
  orderedList,
  alignLeft,
  alignCenter,
  alignRight,
  link,
  embed: {
    id: 'embed',
    context: CONTEXT_MENU,
    options: [
      photo,
      video
    ],
    label: 'embed'
  }
};
