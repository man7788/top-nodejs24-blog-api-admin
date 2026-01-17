import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import routes from '../../routes/routes';
import * as useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import useComments from '../../hooks/useComments';
import verifyToken from '../../api/verifyToken';

const useAuthSpy = vi.spyOn(useAuth, 'default');
vi.mock('../../hooks/usePosts');
vi.mock('../../hooks/useComments');
vi.mock('../../api/verifyToken');

afterEach(() => {
  vi.clearAllMocks();
});

describe('Dashboard', () => {
  beforeAll(() => {
    useAuthSpy.mockReturnValue({
      user: { id: 1 },
      logout: vi.fn(),
      error: null,
      loading: false,
    });

    usePosts.mockReturnValue({
      loading: true,
    });

    verifyToken.mockReturnValue({
      loading: true,
    });
  });

  it('should render dashboard with overview (default view)', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard with overview', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });

    const { container } = render(<RouterProvider router={router} />);

    const posts = screen.getByRole('link', { name: /posts/i });

    await user.click(posts);

    const overview = screen.getByRole('link', { name: /overview/i });

    await user.click(overview);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard with posts', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });

    const { container } = render(<RouterProvider router={router} />);

    const posts = screen.getByRole('link', { name: /posts/i });

    await user.click(posts);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard with comments', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });

    useComments.mockReturnValue({
      loading: true,
    });

    const { container } = render(<RouterProvider router={router} />);

    const comments = screen.getByRole('link', { name: /comments/i });

    await user.click(comments);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard with settings', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });

    const { container } = render(<RouterProvider router={router} />);

    const settings = screen.getByRole('link', { name: /settings/i });

    await user.click(settings);

    expect(container).toMatchSnapshot();
  });

  describe('Pop-up', () => {
    it('should render sidebar popup', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const more = screen.getByRole('button', { name: /more/i });

      await user.click(more);

      expect(container).toMatchSnapshot();
    });

    it('should make sidebar popup disappear', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const more = screen.getByRole('button', { name: /more/i });

      await user.click(more);

      const main = screen.getByRole('main');

      await user.click(main);

      expect(container).toMatchSnapshot();
    });

    it("should logout using auth provider's login method", async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard'],
      });

      // Restore spy otherwise it will override verifyToken mock
      useAuthSpy.mockRestore();

      verifyToken.mockResolvedValue({
        user: { id: 1 },
      });

      const { container } = render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(verifyToken).toHaveBeenCalledTimes(1);
      });

      const more = screen.getByRole('button', { name: /more/i });

      await user.click(more);

      const logoutButton = screen.getByRole('button', { name: /log out/i });

      await user.click(logoutButton);

      expect(container).toMatchSnapshot();
    });
  });
});
