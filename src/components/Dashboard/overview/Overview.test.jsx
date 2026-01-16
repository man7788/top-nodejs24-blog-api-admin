import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import Overview from './Overview';
import routes from '../../../routes/routes';
import useAuth from '../../../hooks/useAuth';
import usePosts from '../../../hooks/usePosts';
import verifyToken from '../../../api/verifyToken';

vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/usePosts');
vi.mock('../../../api/verifyToken');

afterEach(() => {
  vi.clearAllMocks();
});

describe('Dashboard', () => {
  it('should render loading', async () => {
    usePosts.mockReturnValue({
      posts: null,
      error: null,
      loading: true,
    });

    const { container } = render(<Overview />);

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    usePosts.mockReturnValue({
      posts: null,
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<Overview />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', async () => {
    usePosts.mockReturnValue({
      posts: null,
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(<Overview />);

    expect(container).toMatchSnapshot();
  });

  it('should render overview', async () => {
    usePosts.mockReturnValue({
      posts: [{ id: 1 }, { id: 2 }, { id: 3 }],
      error: null,
      loading: false,
    });

    const { container } = render(<Overview />);

    expect(container).toMatchSnapshot();
  });
});
