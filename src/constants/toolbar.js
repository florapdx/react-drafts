/*
 * Toolbar configs.
 *
 * Config shape: {
 *   id: {String} - the id is used to identify the block style to the handler,
 *   type: {String} - identifies the block as requiring inline-styles vs specific markup,
 *   icon: {String || null} - name of font-awesome icon for button, if any; if none, button shows text,
 *   text: {String} - if no icon, button shows text; text also shown on hover-over for icon disambiguation
 * }
 */
const TYPE_BLOCK = 'block';
const TYPE_INLINE = 'inline';

// Headings

const heading1 = {
  id: 'heading-1',
  type: TYPE_INLINE,
  icon: null,
  text: 'Level 1 Heading'
};

const heading2 = {
  id: 'heading-2,
  type: TYPE_INLINE,
  icon: null,
  text: 'Level 2 Heading'
};

const heading3: {
  id: 'heading-3',
  type: TYPE_INLINE,
  icon: null,
  text: 'Level 3 Heading'
};

// Text styles

const bold = {
  id: 'BOLD',
  type: TYPE_INLINE,
  icon: 'bold',
  text: 'bold'
};

const italic = {
  id: 'italic',
  type: TYPE_INLINE,
  icon: 'italic',
  text: 'italic'
};

const underline = {
  id: 'underline',
  icon: 'underline',
  text: 'underline',
  handler: 'handleApplyTextStyle'
};

const strikethrough = {
  id: 'strikethrough',
  icon: 'strikethrough',
  text: 'strikethrough',
  handler: 'handleApplyTextStyle'
};


// Markup decorators

const title = {
  id: 'title',
  icon: null,
  text: 'Title',
  handler: 'handleApplyTextMarkup'
};

const subtitle = {
  id: 'subtitle',
  icon: null,
  text: 'Subtitle',
  handler: 'handleApplyTextMarkup'
};

const bulletList = {
  id: 'bullet',
  icon: 'list',
  text: 'Bullet list',
  handler: 'handleApplyTextMarkup'
};

const orderedList = {
  id: 'ordered',
  icon: 'list',
  text: 'Ordered list',
  handler: 'handleApplyTextMarkup'
};

const quotes = {
  id: 'blockquote',
  icon: 'quote-left',
  text: 'block quote',
  handler: 'handleApplyTextMarkup'
};

const caption = {
  id: 'figcaption',
  icon: null,
  text: 'caption',
  handler: 'handleApplyTextMarkup'
};

const table = {
  id: 'table',
  icon: 'table',
  text: 'table',
  handler: 'handleInsertTable'
};

const image = {
  id: '',
  type: '',
  icon: '',
  text: null,
  handler: ''
};

const embed = {
  id: '',
  icon: '',
  text: null,
  handler: ''
};

export const TOOLBAR_DEFAULTS = {
  headings: {
    id: 'headings',
    type: 'menu',
    options: [
      title,
      subtitle,
      heading1,
      heading2,
      heading3,
      caption
    ]
  },
  bold,
  italic,
  underline,
  strikethrough,
  quotes,
  bullet,
  ordered,
  table,
  image,
  embed
};