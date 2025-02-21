/* global global */
import React from 'react';
import { cleanup, render, configure } from '@testing-library/react';

import App from '../src';
import { expect, vi } from 'vitest';
global.window.close = () => {};
global.window.encodeURIComponent = (x) => x;
global.window.addEventListener = vi.fn();

const LOCATION_ENTRY_SIDEBAR = 'entry-sidebar';
const LOCATION_ENTRY_EDITOR = 'entry-editor';

let LOCATION = '';
let PROJECT_ID = '';
let VALID_FIELDS = false;

function mockSdk() {
  return {
    navigator: {
      openEntry: () => {},
      openNewEntry: () => {},
      onSlideInNavigation: () => {},
    },
    dialogs: {
      selectSingleEntry: () => {},
    },
    parameters: {
      installation: {
        optimizelyProjectId: PROJECT_ID,
      },
    },
    location: {
      is: vi.fn((l) => {
        return l === LOCATION;
      }),
    },
    window: {
      startAutoResizer: () => {},
      stopAutoResizer: () => {},
    },
    ids: {},
    space: {},
    locales: {},
    entry: {
      fields: {
        experimentId: {
          getValue: vi.fn(() => 'exp123'),
          onValueChanged: vi.fn(() => vi.fn()),
        },
        experimentKey: {
          getValue: vi.fn(() => 'exp123'),
          onValueChanged: vi.fn(() => vi.fn()),
        },
        experimentTitle: {
          getValue: vi.fn(() => 'exp123'),
          onValueChanged: vi.fn(() => vi.fn()),
        },
        meta: {
          getValue: vi.fn(),
          onValueChanged: vi.fn(() => vi.fn()),
        },
        variations: {
          getValue: vi.fn(),
          onValueChanged: vi.fn(() => vi.fn()),
        },
      },
      getSys: () => {
        id: '123';
      },
    },
    contentType: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'cyu19ucaypb9',
          },
        },
        id: 'variationContainer',
        type: 'ContentType',
        createdAt: '2019-05-24T07:45:48.863Z',
        updatedAt: '2019-05-30T04:28:43.488Z',
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        revision: 3,
      },
      name: 'Variation Container',
      description: null,
      displayField: 'experimentTitle',
      fields: [
        {
          id: 'experimentTitle',
          name: 'Experiment title',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'experimentId',
          name: 'Experiment ID',
          type: 'Symbol',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'meta',
          name: 'Meta',
          type: 'Object',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
        },
        {
          id: 'variations',
          name: 'Variations',
          type: 'Array',
          localized: false,
          required: false,
          validations: [],
          disabled: false,
          omitted: false,
          items: {
            type: 'Link',
            validations: [],
            linkType: 'Entry',
          },
        },
      ].concat(
        VALID_FIELDS
          ? {
              id: 'experimentKey',
              name: 'Experiment key',
              type: 'Symbol',
              localized: false,
              required: false,
              validations: [],
              disabled: false,
              omitted: false,
            }
          : []
      ),
    },
  };
}

configure({ testIdAttribute: 'data-test-id' });

describe('Optimizely App', () => {
  afterEach(() => {
    cleanup();

    LOCATION = '';
    PROJECT_ID = '';
    VALID_FIELDS = false;
  });

  it('should render the missing project on the sidebar', () => {
    LOCATION = LOCATION_ENTRY_SIDEBAR;
    const sdk = mockSdk();
    const { getByTestId } = render(<App sdk={sdk} />);

    expect(getByTestId('missing-project')).toBeDefined();
  });

  it('should render the sidebar', () => {
    LOCATION = LOCATION_ENTRY_SIDEBAR;
    PROJECT_ID = '123';
    const sdk = mockSdk();
    const { getByTestId } = render(<App sdk={sdk} />);

    expect(getByTestId('sidebar'));
  });

  it('should render the incorrect type message', () => {
    LOCATION = LOCATION_ENTRY_EDITOR;
    PROJECT_ID = '123';
    const sdk = mockSdk();

    const { getByTestId } = render(<App sdk={sdk} />);
    expect(getByTestId('incorrect-type')).toBeDefined();
  });

  it('should render the editor page', () => {
    LOCATION = LOCATION_ENTRY_EDITOR;
    PROJECT_ID = '123';
    VALID_FIELDS = true;
    const sdk = mockSdk();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.getItem = () => {
      return JSON.stringify({
        optToken: 'token',
        optExpire: Date.now() + 24 * 3600 * 1000,
      });
    };

    const { getByTestId } = render(<App sdk={sdk} />);
    expect(getByTestId('editor-page')).toBeDefined();
  });
});
