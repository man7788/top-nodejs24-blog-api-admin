import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import ErrorPage from './ErrorPage';
import App from '../../App';
import useAuth from '../../hooks/useAuth';

vi.mock('../../hooks/usePosts');
vi.mock('../../hooks/useAuth');

afterEach(() => {
  vi.clearAllMocks();
});

const routes = [
  {
    path: '/notfound',
    element: <ErrorPage />,
  },
  {
    path: '/',
    element: <App />,
  },
];

describe('ErrorPage', () => {
  it('should render error page', () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render home', async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      error: null,
      loading: true,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/notfound'],
    });

    const { container } = render(<RouterProvider router={router} />);

    const home = screen.getByRole('link', { name: /return home/i });

    await user.click(home);

    expect(container).toMatchSnapshot();
  });
});
