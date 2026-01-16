import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import Login from './Login';
import routes from '../../routes/routes';
import * as useAuth from '../../hooks/useAuth';
import submitLogin from '../../api/submitLogin';
import verifyToken from '../../api/verifyToken';
import usePosts from '../../hooks/usePosts';

// vi.mock('../../hooks/useAuth');
const useAuthSpy = vi.spyOn(useAuth, 'default');
vi.mock('../../api/submitLogin');
vi.mock('../../api/verifyToken');
vi.mock('../../hooks/usePosts');

afterEach(() => {
  vi.clearAllMocks();
});

describe('Login', () => {
  it('should render loading', () => {
    useAuthSpy.mockReturnValue({
      user: null,
      error: null,
      loading: true,
    });

    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', () => {
    useAuthSpy.mockReturnValue({
      user: null,
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });

  it('should render dashboard', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/login'] });

    useAuthSpy.mockReturnValue({
      user: { id: 1 },
      error: null,
      loading: false,
    });

    verifyToken.mockResolvedValue({
      user: { id: 1 },
      error: null,
    });

    usePosts.mockReturnValue({
      posts: null,
      error: null,
      loading: true,
    });

    const { container } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(verifyToken).toHaveBeenCalledTimes(1);
    });

    expect(container).toMatchSnapshot();
  });

  it('should render Login', () => {
    useAuthSpy.mockReturnValue({
      user: null,
      error: null,
      loading: false,
    });

    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });

  describe('From submission', () => {
    const login = vi.fn();

    beforeAll(() => {
      useAuthSpy.mockReturnValue({
        user: null,
        login,
        error: null,
        loading: false,
      });
    });

    it('should render user input and submit form', async () => {
      const user = userEvent.setup();

      submitLogin.mockReturnValue({
        token: 'mockedUserToken',
      });

      render(<Login />);

      const email = screen.getByRole('textbox', { name: /email/i });
      const password = screen.getByLabelText(/password/i);

      await user.type(email, 'foo@bar.com');
      await user.type(password, 'foobar');

      expect(email.value).toMatch('foo@bar.com');
      expect(password.value).toMatch('foobar');

      const loginButton = screen.getByRole('button', { name: /log in/i });

      await user.click(loginButton);

      expect(submitLogin).toHaveBeenCalledWith('foo@bar.com', 'foobar');
    });

    it('should render user input validation failed message (generic)', async () => {
      const user = userEvent.setup();

      submitLogin.mockReturnValue({
        error: {
          details: [
            {
              field: 'generic',
              message: 'Generic failed input valiation message',
            },
          ],
        },
      });

      render(<Login />);

      const login = screen.getByRole('button', { name: /log in/i });

      await user.click(login);

      const genericErr = screen.getByText(
        'Generic failed input valiation message',
      );

      expect(genericErr.textContent).toMatch(
        'Generic failed input valiation message',
      );
    });

    it('should render user input validation failed', async () => {
      const user = userEvent.setup();

      submitLogin.mockReturnValue({
        error: {
          details: [
            {
              field: 'email',
              message: 'Failed email input validation message',
            },
            {
              field: 'password',
              message: 'Failed password input validation message',
            },
          ],
        },
      });

      render(<Login />);

      const login = screen.getByRole('button', { name: /log in/i });

      await user.click(login);

      const emailErr = screen.getByText(
        'Failed email input validation message',
      );
      const passwordErr = screen.getByText(
        'Failed password input validation message',
      );

      expect(emailErr.textContent).toMatch(
        'Failed email input validation message',
      );
      expect(passwordErr.textContent).toMatch(
        'Failed password input validation message',
      );
    });

    it('should render from submit error', async () => {
      const user = userEvent.setup();

      submitLogin.mockReturnValue({ error: { message: 'Server Error' } });

      const { container } = render(<Login />);

      const login = screen.getByRole('button', { name: /log in/i });

      await user.click(login);

      expect(container).toMatchSnapshot();
    });

    it('should render login error', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, { initialEntries: ['/login'] });

      verifyToken.mockResolvedValue({
        error: { statusCode: 401 },
      });

      login.mockReturnValue({ error: { message: 'Server Error' } });

      submitLogin.mockReturnValue({
        token: 'mockedUserToken',
      });

      const { container } = render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(verifyToken).toHaveBeenCalledTimes(1);
      });

      const email = screen.getByRole('textbox', { name: /email/i });
      const password = screen.getByLabelText(/password/i);

      await user.type(email, 'foo@bar.com');
      await user.type(password, 'foobar');

      const loginButton = screen.getByRole('button', { name: /log in/i });

      await user.click(loginButton);

      await waitFor(() => {
        expect(login).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
    });

    it("should login using auth provider's login method", async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, { initialEntries: ['/login'] });

      // Restore spy otherwise it will override verifyToken mock
      useAuthSpy.mockRestore();

      verifyToken.mockResolvedValue({
        error: { statusCode: 401 },
      });

      submitLogin.mockReturnValue({
        token: 'mockedUserToken',
      });

      const { container } = render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(verifyToken).toHaveBeenCalledTimes(1);
      });

      const email = screen.getByRole('textbox', { name: /email/i });
      const password = screen.getByLabelText(/password/i);

      await user.type(email, 'foo@bar.com');
      await user.type(password, 'foobar');

      const loginButton = screen.getByRole('button', { name: /log in/i });

      verifyToken.mockResolvedValue({
        user: { id: 1 },
        error: null,
      });

      usePosts.mockReturnValue({
        posts: null,
        error: null,
        loading: true,
      });

      await user.click(loginButton);

      await waitFor(() => {
        expect(verifyToken).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(container).toMatchSnapshot();
      });
    });
  });
});
