import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Password from './Password';
import useVerifyToken from '../../../../hooks/useVerifyToken';
import submitPassword from '../../../../api/submitPassword';

vi.mock('../../../../hooks/useVerifyToken');
vi.mock('../../../../api/submitPassword');

afterEach(() => {
  vi.clearAllMocks();
});

describe('Password', () => {
  it('should render loading', async () => {
    useVerifyToken.mockReturnValue({
      error: null,
      loading: true,
    });

    const { container } = render(<Password />);

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useVerifyToken.mockReturnValue({
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<Password />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', async () => {
    useVerifyToken.mockReturnValue({
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(<Password />);

    expect(container).toMatchSnapshot();
  });

  it('should render profile', async () => {
    useVerifyToken.mockReturnValue({
      error: null,
      loading: false,
    });

    const { container } = render(<Password />);

    expect(container).toMatchSnapshot();
  });

  describe('Form submission', () => {
    beforeAll(() => {
      useVerifyToken.mockReturnValue({
        error: null,
        loading: false,
      });
    });

    it('should render user input and submit form', async () => {
      const user = userEvent.setup();

      submitPassword.mockReturnValue({
        error: null,
      });

      render(<Password />);

      const currentPassword = screen.getByLabelText(/current password/i);
      const newPassword = screen.getByLabelText(/new password/i);
      const passwordConfirmation = screen.getByLabelText(
        /password confirmation/i,
      );

      await user.clear(currentPassword);
      await user.clear(newPassword);
      await user.clear(passwordConfirmation);
      await user.type(currentPassword, 'foobar');
      await user.type(newPassword, 'johndoe');
      await user.type(passwordConfirmation, 'johndoe');

      expect(currentPassword.value).toMatch('foobar');
      expect(newPassword.value).toMatch('johndoe');
      expect(passwordConfirmation.value).toMatch('johndoe');

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      const success = screen.getByText('Password successfully updated');

      expect(submitPassword).toHaveBeenCalledWith(
        'foobar',
        'johndoe',
        'johndoe',
      );
      expect(success).toBeInTheDocument();
      expect(currentPassword.value).toMatch('');
      expect(newPassword.value).toMatch('');
      expect(passwordConfirmation.value).toMatch('');
    });

    it('should render user input validation failed', async () => {
      const user = userEvent.setup();

      submitPassword.mockReturnValue({
        error: {
          details: [
            {
              field: 'currentPassword',
              message: 'Failed current password input validation message',
            },
            {
              field: 'newPassword',
              message: 'Failed new password input validation message',
            },
            {
              field: 'passwordConfirmation',
              message: 'Failed password confirmation input validation message',
            },
          ],
        },
      });

      render(<Password />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      const currentPasswordErr = screen.getByText(
        'Failed current password input validation message',
      );
      const newPasswordErr = screen.getByText(
        'Failed new password input validation message',
      );
      const passwordConfirmationErr = screen.getByText(
        'Failed password confirmation input validation message',
      );

      expect(currentPasswordErr.textContent).toMatch(
        'Failed current password input validation message',
      );
      expect(newPasswordErr.textContent).toMatch(
        'Failed new password input validation message',
      );
      expect(passwordConfirmationErr.textContent).toMatch(
        'Failed password confirmation input validation message',
      );
    });

    it('should render form submit error', async () => {
      const user = userEvent.setup();

      submitPassword.mockReturnValue({ error: { message: 'Server Error' } });

      const { container } = render(<Password />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });
  });
});
