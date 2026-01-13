import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import App from './App';
import routes from './routes/routes';
import useAuth from './hooks/useAuth';

vi.mock('./hooks/useAuth');

describe('App', () => {
  it('should render loading', () => {
    useAuth.mockReturnValue({
      error: null,
      loading: true,
    });

    const { container } = render(<App />);

    expect(container).toMatchSnapshot();
  });

  it('should render login', () => {
    const router = createMemoryRouter(routes);

    useAuth.mockReturnValue({
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', () => {
    const router = createMemoryRouter(routes);

    useAuth.mockReturnValue({
      error: { statusCode: 404 },
      loading: false,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard', () => {
    const router = createMemoryRouter(routes);

    useAuth.mockReturnValue({
      user: { id: 1 },
      error: null,
      loading: false,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });
});
