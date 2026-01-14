import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import PrivateRoute from './PrivateRoute';
import routes from '../../routes/routes';
import useAuth from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');

afterEach(() => {
  vi.clearAllMocks();
});

describe('PrivateRoute', () => {
  it('should render loading', async () => {
    useAuth.mockReturnValue({
      user: null,
      error: null,
      loading: true,
    });

    const { container } = render(<PrivateRoute />);

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useAuth.mockReturnValue({
      user: null,
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<PrivateRoute />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', async () => {
    useAuth.mockReturnValue({
      user: null,
      error: { error: { message: 'Server Error' } },
      loading: false,
    });

    const { container } = render(<PrivateRoute />);

    expect(container).toMatchSnapshot();
  });

  it('should render login', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/login'] });

    useAuth.mockReturnValue({
      user: null,
      error: null,
      loading: false,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/login'] });

    useAuth.mockReturnValue({
      user: { id: 1 },
      error: null,
      loading: false,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });
});
