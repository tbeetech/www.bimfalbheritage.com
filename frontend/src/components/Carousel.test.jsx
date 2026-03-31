import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Carousel from './Carousel';

describe('Carousel auto-slide timing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('auto-advances at the slowed default interval', () => {
    const items = ['One', 'Two', 'Three', 'Four'];

    render(
      <Carousel
        items={items}
        renderItem={(item) => <span>{item}</span>}
      />
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
    expect(screen.queryByText('Four')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5850);
    });

    expect(screen.queryByText('One')).not.toBeInTheDocument();
    expect(screen.getByText('Four')).toBeInTheDocument();
  });
});
