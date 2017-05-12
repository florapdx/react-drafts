import React from 'react';
import { OrderedSet } from 'immutable';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import { oneLineTrim } from 'common-tags';
import { convertFromRaw, ContentState } from 'draft-js';
import { TOOLBAR_DEFAULTS } from '../src/constants/toolbar';
import {
  convertToHTML,
  testToHTMLInternals
} from '../src/utils/export-to-html';
import {
  convertFromHTML,
  testFromHTMLInternals
} from '../src/utils/import-from-html';

describe('converting to html', () => {
  describe('converting inline styles', () => {
    it('should assign the correct text alignment given an align style', () => {
      const actual = testToHTMLInternals.convertInline(TOOLBAR_DEFAULTS.alignRight.id);
      const expected = '<span style="display:block;text-align:right;"></span>';
      expect(renderToStaticMarkup(actual)).to.equal(expected);
    });
  });

  describe('converting blocks', () => {
    const buildContentState = (blocks, entityMap = {}) => {
      return convertFromRaw({
        entityMap,
        blocks: blocks.map(({ type = 'unstyled', depth = 0, text = '', inlineStyleRanges = [], entityRanges = [], data = {} }) => {
          return {
            type,
            depth,
            text,
            inlineStyleRanges,
            entityRanges,
            data
          };
        })
      });
    };

    it('should convert successive empty blocks to <br>s to preserve newlines', () => {
      const contentState = buildContentState([
        {
          type: 'unstyled',
          text: ''
        },
        {
          type: 'unstyled',
          text: ''
        }
      ]);

      expect(convertToHTML(contentState)).to.equal('<p></p><br>');
    });

    it('should add class name reflecting entity type to atomic wrapper figure tag', () => {
      const contentState = buildContentState([
        {
          type: 'atomic',
          text: ' ',
          entityRanges: [
            {
              key: 0,
              length: 1,
              offset: 0
            }
          ]
        }
      ],
      {
        0: {
          type: 'photo',
          mutability: 'IMMUTABLE',
          data: {
            src: 'test.com'
          }
        }
      });

      const expected = oneLineTrim`
        <figure class="atomic photo-block">
          <figure class="content-editor__custom-block photo">
            <img src="test.com">
          </figure>
        </figure>
      `;
      expect(convertToHTML(contentState, TOOLBAR_DEFAULTS)).to.equal(expected);
    });
  });

  describe('converting entities', () => {
    it('should return a Link rendered to markup when given a link entity', () => {
      const markup = testToHTMLInternals.convertEntity({
        type: TOOLBAR_DEFAULTS.link.id,
        data: {
          url: 'test.com'
        }
      }, TOOLBAR_DEFAULTS);

      const expected = oneLineTrim`
        <a class="content-editor__custom-block link" href="test.com" target="_self" rel="">
        </a>
      `;
      expect(markup).to.equal(expected);
    });

    it('should return a Divider rendered to markup when given a divider entity', () => {
      const markup = testToHTMLInternals.convertEntity({
        type: TOOLBAR_DEFAULTS.divider.id,
        data: {}
      }, TOOLBAR_DEFAULTS);

      expect(markup).to.equal('<hr/>');
    });

    it('should return a Document rendered to markup when given a file entity', () => {
      const markup = testToHTMLInternals.convertEntity({
        type: TOOLBAR_DEFAULTS.file.id,
        data: {
          src: 'test.com',
          name: 'test'
        }
      }, TOOLBAR_DEFAULTS);

      const expected = oneLineTrim`
        <figure class="content-editor__custom-block document">
          <a class="file-name" href="test.com" download="test">test</a>
        </figure>
      `;
      expect(markup).to.equal(expected);
    });

    it('should return a Photo rendered to markup when given a photo entity', () => {
      const markup = testToHTMLInternals.convertEntity({
        type: TOOLBAR_DEFAULTS.photo.id,
        data: {
          src: 'test.com'
        }
      }, TOOLBAR_DEFAULTS);

      const expected = oneLineTrim`
        <figure class="content-editor__custom-block photo">
          <img src="test.com"/>
        </figure>`
      ;
      expect(markup).to.equal(expected);
    });

    it('should return a Rich embed rendered to markup when given a rich embed entity', () => {
      const markup = testToHTMLInternals.convertEntity({
        type: TOOLBAR_DEFAULTS.rich.id,
        data: {
          src: 'test.com'
        }
      }, TOOLBAR_DEFAULTS);

      const expected = oneLineTrim`
        <figure class="content-editor__custom-block rich">
          <div class="rich-media-wrapper">
            <iframe src="test.com" frameborder="0" allowfullscreen=""></iframe>
          </div>
        </figure>
      `;
      expect(markup).to.equal(expected);
    });
  });

  describe('cleaning html', () => {
    it('should remove erroneously applied innerText in figure tags', () => {
      const html = oneLineTrim`
        <figure class="atomic">
          <figure>
            <figcaption>TEST!</figcaption>
          </figure>
          TEST!
        </figure>
      `;

      const expected = oneLineTrim`
        <figure class="atomic">
          <figure>
            <figcaption>TEST!</figcaption>
          </figure>
        </figure>
      `;

      expect(testToHTMLInternals.cleanHTML(html)).to.equal(expected);
    });
  });
});

describe('converting from html', () => {
  describe('converting to inline', () => {
    it('should convert text-align styles to custom inline align-* rule', () => {
      const node = document.createElement('span');
      node.setAttribute('style', 'text-align:center');
      const currentStyle = new OrderedSet();

      expect(testFromHTMLInternals.convertToInline('span', node, currentStyle).toJSON()[0])
        .to.equal(TOOLBAR_DEFAULTS.alignCenter.id);
    });
  });

  describe('converting to block', () => {
    it('should return block of type atomic for any figure tag', () => {
      const node = document.createElement('figure');
      expect(testFromHTMLInternals.convertToBlock('figure', node)).to.equal('atomic');
    });

    it('should return null for any table tag (since tables are rendered by entity component)', () => {
      const node = document.createElement('table');
      expect(testFromHTMLInternals.convertToBlock('table', node)).to.be.null;
    });
  });

  describe('converting to entity', () => {
    const contentState = new ContentState();
    const configs = TOOLBAR_DEFAULTS;

    describe('entity type', () => {
      it('should return a document entity for <a> tags with class "file-name"', () => {
        const node = document.createElement('a');
        node.setAttribute('class', 'file-name');

        const entityKey = testFromHTMLInternals
          .convertToEntity('a', node, contentState, configs);

        expect(contentState.getEntity(entityKey).getType())
          .to.equal(configs.file.id);
      });

      it('should return a link entity for all other <a> tags', () => {
        const node = document.createElement('a');

        const entityKey = testFromHTMLInternals
          .convertToEntity('a', node, contentState, configs);

        expect(contentState.getEntity(entityKey).getType())
          .to.equal(configs.link.id);
      });

      it('should return a photo entity for <img> tags', () => {
        const parent = document.createElement('figure');
        const node = document.createElement('img');
        parent.appendChild(node);

        const entityKey = testFromHTMLInternals
          .convertToEntity('img', node, contentState, configs);

        expect(contentState.getEntity(entityKey).getType())
          .to.equal(configs.photo.id);
      });

      it('should return a rich entity for <iframe> tags', () => {
        const parent = document.createElement('figure');
        const node = document.createElement('iframe');
        parent.appendChild(node);

        const entityKey = testFromHTMLInternals
          .convertToEntity('iframe', node, contentState, configs);

        expect(contentState.getEntity(entityKey).getType())
          .to.equal(configs.rich.id);
      });

      it('should return a divider entity for <hr> tags', () => {
        const node = document.createElement('hr');

        const entityKey = testFromHTMLInternals
          .convertToEntity('hr', node, contentState, configs);

        expect(contentState.getEntity(entityKey).getType())
          .to.equal(configs.divider.id);
      });

      it('should return a table entity for <table> tags', () => {
        const node = document.createElement('table');
        const child1 = document.createElement('thead');
        const child2 = document.createElement('tbody');
        node.appendChild(child1);
        node.appendChild(child2);

        const entityKey = testFromHTMLInternals
          .convertToEntity('table', node, contentState, configs);

        expect(contentState.getEntity(entityKey).getType())
          .to.equal(configs.table.id);
      });
    });

    describe('entity data: ', () => {
      describe('photos', () => {
        it('should return the src attribute value', () => {
          const parent = document.createElement('figure');
          const node = document.createElement('img');
          node.setAttribute('src', 'photosrus.com');
          parent.appendChild(node);

          const entityKey = testFromHTMLInternals
            .convertToEntity('img', node, contentState, configs);

          expect(contentState.getEntity(entityKey).getData().src)
            .to.equal('photosrus.com')
        });

        it('should return width and maxHeight data from styles', () => {
          const parent = document.createElement('figure');
          const node = document.createElement('img');
          node.setAttribute('style', 'width:200px;max-height:150px');
          parent.appendChild(node);

          const entityKey = testFromHTMLInternals
            .convertToEntity('img', node, contentState, configs);
          const data = contentState.getEntity(entityKey).getData();

          expect(data.width).to.equal('200');
          expect(data.height).to.equal('150');
        });

        it('should return href and target values if photo is encased in a link', () => {
          const parent = document.createElement('a');
          const node = document.createElement('img');
          parent.setAttribute('href', 'alink.com');
          parent.setAttribute('target', '_blank');
          parent.appendChild(node);

          const entityKey = testFromHTMLInternals
            .convertToEntity('img', node, contentState, configs);
          const data = contentState.getEntity(entityKey).getData();

          expect(data.href).to.equal('alink.com');
          expect(data.target).to.equal('_blank');
        });

        it('should return caption value if there is a caption', () => {
          const parent = document.createElement('figure');
          const node = document.createElement('img');
          const node2 = document.createElement('figcaption');
          node2.innerText = 'A caption';
          parent.appendChild(node);
          parent.appendChild(node2);

          const entityKey = testFromHTMLInternals
            .convertToEntity('img', node, contentState, configs);
          const data = contentState.getEntity(entityKey).getData();

          expect(data.caption).to.equal('A caption');
        });
      });

      describe('rich embeds', () => {
        it('should return the src attribute value', () => {
          const parent = document.createElement('figure');
          const node = document.createElement('iframe');
          node.setAttribute('src', 'iframesrus.com');
          parent.appendChild(node);

          const entityKey = testFromHTMLInternals
            .convertToEntity('iframe', node, contentState, configs);

          expect(contentState.getEntity(entityKey).getData().src)
            .to.equal('iframesrus.com');
        });

        it('should return width and height attribute values', () => {
          const parent = document.createElement('figure');
          const node = document.createElement('iframe');
          node.setAttribute('width', '300');
          node.setAttribute('height', '200');
          parent.appendChild(node);

          const entityKey = testFromHTMLInternals
            .convertToEntity('iframe', node, contentState, configs);
          const data = contentState.getEntity(entityKey).getData();

          expect(data.width).to.equal('300');
          expect(data.height).to.equal('200');
        });

        it('should return caption value, if caption present', () => {
          const parent = document.createElement('figure');
          const wrapper = document.createElement('div');
          const node = document.createElement('iframe');
          const caption = document.createElement('figcaption');
          caption.innerText = 'Another caption';

          wrapper.appendChild(node);
          parent.appendChild(wrapper);
          parent.appendChild(caption);

          const entityKey = testFromHTMLInternals
            .convertToEntity('iframe', node, contentState, configs);

          expect(contentState.getEntity(entityKey).getData().caption)
            .to.equal('Another caption');
        });
      });

      describe('documents', () => {
        it('should return the src attribute value', () => {
          const node = document.createElement('a');
          node.setAttribute('class', 'file-name');
          node.setAttribute('href', 'documentsrus.com');

          const entityKey = testFromHTMLInternals
            .convertToEntity('a', node, contentState, configs);

          expect(contentState.getEntity(entityKey).getData().src)
            .to.equal('documentsrus.com');
        });

        it('should return the href and download attribute values', () => {
          const node = document.createElement('a');
          node.setAttribute('class', 'file-name');
          node.setAttribute('href', 'documentsrus.com');
          node.setAttribute('download', 'a_document.pdf');

          const entityKey = testFromHTMLInternals
            .convertToEntity('a', node, contentState, configs);
          const data = contentState.getEntity(entityKey).getData();

          expect(data.src).to.equal('documentsrus.com');
          expect(data.name).to.equal('a_document.pdf');
        });
      });

      describe('tables', () => {
        it('should return table title', () => {

        });

        it('should return table data', () => {

        });
      });
    });
  });
});
