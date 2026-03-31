import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Home from './Home';
import { getPosts } from '../services/api';

vi.mock('../services/api', () => ({
  getPosts: vi.fn(),
}));

describe('Home page', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getPosts.mockResolvedValue({
      data: [
        {
          id: 'post-1',
          title: 'Sample post',
          body: 'Sample body',
          publishDate: '2026-01-01T00:00:00.000Z',
          coverImage: '',
        },
      ],
      pagination: { page: 1, pages: 1, total: 1, limit: 6 },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('renders Blogs and Articles section without console errors', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /blogs and articles/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(getPosts).toHaveBeenCalledWith(1, 6);
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
