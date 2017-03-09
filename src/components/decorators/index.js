import { CompositeDecorator } from 'draft-js';
import linkDecorator from './link';

/*
 * Decorators.
 * Unlike custom blocks, decorators are inlined entities, and are therefore
 * not wrapped in default tags (ie, `figure`s) like atomic blocks.
 * Decorators are ranges of text that require some special markup or styling,
 * and are useful for creating things like links (regular, @mentions, etc) and
 * hightlights, etc.
 * Each decorator is created by passing a DraftDecorator object with shape:
 *   { strategy: findEntityMethod, component: DecoratorWrapper }
 * to the CompositeDecorator constructor.
 */
const decorators = new CompositeDecorator([
  linkDecorator
]);

export default decorators
