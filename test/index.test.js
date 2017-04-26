import React from 'react';
import { OrderedSet } from 'immutable';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'chai';
import { oneLineTrim } from 'common-tags';
import { convertFromRaw } from 'draft-js';
import { TOOLBAR_DEFAULTS } from '../src/constants/toolbar';
import {
  convertToHTML,
  testToHTMLInternals
} from '../src/utils/export-to-html';
import {
  convertFromHTML,
  testFromHTMLInternals
} from '../src/utils/import-from-html';

import Link from '../src/components/custom/link';
import Divider from '../src/components/custom/divider';
import Document from '../src/components/custom/document';
import Photo from '../src/components/custom/photo';
import Video from '../src/components/custom/video';

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
          src: 'test.com'
        }
      }, TOOLBAR_DEFAULTS);

      expect(markup).to.equal('<a class="content-editor__custom-block link"></a>');
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

    it('should return a Video rendered to markup when given a video entity', () => {
      const markup = testToHTMLInternals.convertEntity({
        type: TOOLBAR_DEFAULTS.video.id,
        data: {
          src: 'test.com'
        }
      }, TOOLBAR_DEFAULTS);

      const expected = oneLineTrim`
        <figure class="content-editor__custom-block video">
          <div class="video-wrapper">
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

  xdescribe('converting to block', () => {
    it('should return block of type atomic for any figure tag', () => {

    });
  });

  xdescribe('converting to entity', () => {
    it('should return a document entity for <a> tags with class "file-name"', () => {

    });

    it('should return a link entity for all other <a> tags', () => {

    });

    it('should return a photo entity for <img> tags', () => {

    });

    it('should return a video entity for <iframe> tags', () => {

    });

    it('should return a divider entity for <hr> tags', () => {

    });
  });
});
