import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import Settings from './Settings';
import Profile from './profile/Profile';
import Password from './password/Password';
import useAuth from '../../../hooks/useAuth';
import useVerifyToken from '../../../hooks/useVerifyToken';

vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/useVerifyToken');

afterEach(() => {
  vi.clearAllMocks();
});

const routes = [
  {
    path: '/dashboard',
    element: <Settings />,
    children: [
      { path: 'settings', element: <Profile /> },
      { path: 'profile', element: <Profile /> },
      { path: 'password', element: <Password /> },
    ],
  },
];

describe('Settings', () => {
  beforeAll(() => {
    useAuth.mockReturnValue({
      user: null,
    });

    useVerifyToken.mockReturnValue({
      error: null,
      loading: true,
    });
  });

  it('should render settings with profile (default view)', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/settings'],
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  it('should render settings with profile', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/settings'],
    });

    const { container } = render(<RouterProvider router={router} />);

    const password = screen.getByRole('link', { name: /password/i });

    await user.click(password);

    const profile = screen.getByRole('link', { name: /profile/i });

    await user.click(profile);

    expect(container).toMatchSnapshot();
  });

  it('should render settings with password', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/settings'],
    });

    const { container } = render(<RouterProvider router={router} />);

    const password = screen.getByRole('link', { name: /password/i });

    await user.click(password);

    expect(container).toMatchSnapshot();
  });
});
