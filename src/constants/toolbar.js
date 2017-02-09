/*
 * Toolbar configs.
 *
 * Config shape: {
 *   id: {String} - the id gets passed to the handler so the right change can be applied,
 *   icon: {String || null} - name of font-awesome icon for button, if any; if none, button shows text,
 *   text: {String} - if no icon, button shows text; text also shown on hover-over for icon disambiguation
 *   handler: {String} - name of the handler responsible for responding to toolbar button click
 * }
 */

const handleApplyHeadline = id => {};
const handle

// Headings
// These are style, and not markup definitions

const heading1 = {
  id: 'headline-1',
  icon: null,
  text: 'Headline 1'
  handler: 'handleApplyHeadline'
};

const heading2 = {
  id: 'headline-2',
  icon: null,
  text: 'Headline 2'
  handler: 'handleApplyHeadline'
};

const heading3: {
  id: 'headline-2',
  icon: null,
  text: 'Headline 3',
  handler: 'handleApplyHeadline'
};


// Text styles

const bold = {
  id: 'bold',
  icon: 'bold',
  text: 'bold',
  handler: 'handleApplyTextStyle'
};

const italic = {
  id: 'italic',
  icon: 'italic',
  text: 'italic',
  handler: 'handleApplyTextStyle'
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

const quotes = {
  id: 'blockquote',
  icon: 'quote-left',
  text: 'block quote',
  handler: 'handleApplyTextMarkup'
};

const code = {
  id: 'code',
  icon: 'code',
  text: 'code',
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
  icon: '',
  text: 'table',
  handler: 'handleInsertTable'
};

const image = {
  id: '',
  icon: '',
  text: null,
  handler: ''
};

const video = {
  id: '',
  icon: '',
  text: null,
  handler: ''
};

const audio = {
  id: '',
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

export const TOOLBAR_DEFAULTS = { // I think this needs work
  headings: {
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
  code,
  table,
  image,
  video,
  audio,
  embed
};