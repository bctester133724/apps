import { render, screen } from '@testing-library/react';
import { config } from 'config';
import { useContext } from 'react';
import { mockSdk } from '../../test/mocks';
import { mockSegmentAnalytics } from '../../test/mocks/mockSegmentAnalytics';
import { SegmentAnalyticsContext, SegmentAnalyticsProvider } from './SegmentAnalyticsProvider';
import { vi } from 'vitest';

vi.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
}));

vi.mock('@segment/analytics-next', () => ({ AnalyticsBrowser: mockSegmentAnalytics }));

describe('SegmentAnalyticsProvider', () => {
  const TestComponent = () => {
    const { segmentAnalytics } = useContext(SegmentAnalyticsContext);
    segmentAnalytics?.track('foo');

    return <div>children</div>;
  };

  it('provides a segmentAnalytics browser to its children', () => {
    vi.spyOn(mockSegmentAnalytics, 'load');

    render(
      <SegmentAnalyticsProvider>
        <TestComponent />
      </SegmentAnalyticsProvider>
    );

    expect(screen.getByText('children')).toBeVisible();
    expect(mockSegmentAnalytics.load).toHaveBeenCalledWith({ writeKey: config.segmentWriteKey });
    expect(mockSegmentAnalytics.track).toHaveBeenCalledWith('foo');
  });
});
