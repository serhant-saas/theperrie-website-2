import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { OFF_CANVAS_NAVIGATION_QUERYResult } from '../sanity/types';
import { transformOffCanvasNavigation } from './off-canvas-navigation-transform';

test('transformOffCanvasNavigation completes when highlightedLink is omitted', () => {
  const data = {
    _id: 'nav',
    _type: 'offCanvasNavigation',
    items: [],
  };

  const result = transformOffCanvasNavigation(
    data as unknown as OFF_CANVAS_NAVIGATION_QUERYResult
  );

  assert.deepEqual(result.columns, []);
  assert.equal(result.highlightedLink, undefined);
});

test('transformOffCanvasNavigation maps highlightedLink when present', () => {
  const result = transformOffCanvasNavigation({
    _id: 'nav',
    _type: 'offCanvasNavigation',
    items: [],
    highlightedLink: {
      _type: 'singleLinkNavigationItem',
      label: 'Register',
      uppercase: true,
      linkType: 'external',
      internalLink: null,
      externalLink: 'https://example.com/register',
      staticLink: null,
      newTab: true,
    },
  });

  assert.deepEqual(result.highlightedLink, {
    link: 'https://example.com/register',
    label: 'Register',
    newTab: true,
    key: '',
    uppercase: true,
  });
});

test('transformOffCanvasNavigation maps nested static links', () => {
  const result = transformOffCanvasNavigation({
    _id: 'nav',
    _type: 'offCanvasNavigation',
    items: [
      {
        _type: 'headerNavigationColumn',
        items: [
          {
            _key: 'multi-1',
            _type: 'multiLinkNavigationItem',
            label: 'Visit',
            uppercase: null,
            linkType: null,
            internalLink: null,
            externalLink: null,
            staticLink: null,
            newTab: null,
            items: [
              {
                _key: 'nested-static',
                _type: 'singleLinkNavigationItem',
                label: 'Contact',
                uppercase: false,
                linkType: 'static',
                internalLink: null,
                externalLink: null,
                staticLink: '/contact',
                newTab: false,
              },
            ],
          },
        ],
      },
    ],
    highlightedLink: null,
  });

  assert.deepEqual(result.columns, [
    {
      key: '0',
      items: [
        {
          index: 0,
          type: 'multiLinkNavigationItem',
          item: {
            label: 'Visit',
            items: [
              {
                link: '/contact',
                label: 'Contact',
                newTab: false,
                key: 'nested-static',
                uppercase: false,
              },
            ],
          },
        },
      ],
    },
  ]);
});

test('transformOffCanvasNavigation maps highlighted static links', () => {
  const result = transformOffCanvasNavigation({
    _id: 'nav',
    _type: 'offCanvasNavigation',
    items: [],
    highlightedLink: {
      _type: 'singleLinkNavigationItem',
      label: 'Contact',
      uppercase: false,
      linkType: 'static',
      internalLink: null,
      externalLink: null,
      staticLink: '/contact',
      newTab: false,
    },
  });

  assert.deepEqual(result.highlightedLink, {
    link: '/contact',
    label: 'Contact',
    newTab: false,
    key: '',
    uppercase: false,
  });
});
