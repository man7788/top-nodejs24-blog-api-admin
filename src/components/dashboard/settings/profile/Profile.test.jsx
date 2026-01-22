import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Profile from './Profile';
import useAuth from '../../../../hooks/useAuth';
import useVerifyToken from '../../../../hooks/useVerifyToken';
import submitProfile from '../../../../api/submitProfile';

vi.mock('../../../../hooks/useAuth');
vi.mock('../../../../hooks/useVerifyToken');
vi.mock('../../../../api/submitProfile');

afterEach(() => {
  vi.clearAllMocks();
});

describe('Profile', () => {
  beforeAll(() => {
    useAuth.mockReturnValue({
      user: null,
    });
  });

  it('should render loading', async () => {
    useVerifyToken.mockReturnValue({
      error: null,
      loading: true,
    });

    const { container } = render(<Profile />);

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useVerifyToken.mockReturnValue({
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<Profile />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', async () => {
    useVerifyToken.mockReturnValue({
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(<Profile />);

    expect(container).toMatchSnapshot();
  });

  it('should render profile', async () => {
    useAuth.mockReturnValue({
      user: { name: 'foobar' },
    });

    useVerifyToken.mockReturnValue({
      error: null,
      loading: false,
    });

    const { container } = render(<Profile />);

    expect(container).toMatchSnapshot();
  });

  describe('Form submission', () => {
    beforeAll(() => {
      const setUpdate = vi.fn();

      useAuth.mockReturnValue({
        user: { name: 'foobar' },
        update: false,
        setUpdate,
      });

      useVerifyToken.mockReturnValue({
        error: null,
        loading: false,
      });
    });

    it('should render user input and submit form', async () => {
      const user = userEvent.setup();

      render(<Profile />);

      submitProfile.mockReturnValue({
        error: null,
      });

      const name = screen.getByRole('textbox', { name: /name/i });

      await user.clear(name);
      await user.type(name, 'john doe');

      expect(name.value).toMatch('john doe');

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      const success = screen.getByText('Profile successfully updated');

      expect(submitProfile).toHaveBeenCalledWith('john doe');
      expect(success).toBeInTheDocument();
    });

    it('should render user input validation failed', async () => {
      const user = userEvent.setup();

      submitProfile.mockReturnValue({
        error: {
          details: [
            {
              field: 'name',
              message: 'Failed name input validation message',
            },
          ],
        },
      });

      render(<Profile />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      const nameErr = screen.getByText('Failed name input validation message');

      expect(nameErr.textContent).toMatch(
        'Failed name input validation message',
      );
    });

    it('should render form submit error', async () => {
      const user = userEvent.setup();

      submitProfile.mockReturnValue({ error: { message: 'Server Error' } });

      const { container } = render(<Profile />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });
  });
});
