import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import PostCreate from './PostCreate';
import useVerifyToken from '../../../../hooks/useVerifyToken';
import submitPostCreate from '../../../../api/submitPostCreate';

vi.mock('../../../api/submitPostUpdate');
vi.mock('../../../../hooks/useVerifyToken');
vi.mock('../../../../api/submitPostCreate');

afterEach(() => {
  vi.clearAllMocks();
});

describe('Post Create', () => {
  it('should render loading', async () => {
    useVerifyToken.mockReturnValue({
      error: null,
      loading: true,
    });

    const { container } = render(
      <MemoryRouter>
        <PostCreate />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useVerifyToken.mockReturnValue({
      error: { statudCode: 401 },
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PostCreate />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render error ', async () => {
    useVerifyToken.mockReturnValue({
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PostCreate />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render post create ', async () => {
    useVerifyToken.mockReturnValue({
      error: null,
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PostCreate />
      </MemoryRouter>,
    );

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

      submitPostCreate.mockReturnValue({
        error: null,
      });

      render(
        <MemoryRouter>
          <PostCreate />
        </MemoryRouter>,
      );

      const title = screen.getByRole('textbox', { name: /title/i });
      const content = screen.getByRole('textbox', { name: /content/i });
      const select = screen.getByRole('combobox', { name: /status/i });
      const unpublished = screen.getByRole('option', { name: /unpublished/i });

      await user.type(title, 'New post title');
      await user.type(content, 'New post content');
      await user.selectOptions(select, 'Unpublished');

      expect(title.value).toMatch('New post title');
      expect(content.value).toMatch('New post content');
      expect(unpublished.selected).toBe(true);
      expect(select.value).toBe('false');

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(submitPostCreate).toHaveBeenCalledWith(
        'New post title',
        'New post content',
        false,
      );
    });

    it('should render user input validation failed', async () => {
      const user = userEvent.setup();

      submitPostCreate.mockReturnValue({
        error: {
          details: [
            {
              field: 'title',
              message: 'Failed title input validation message',
            },
            {
              field: 'content',
              message: 'Failed content input validation message',
            },
          ],
        },
      });

      render(
        <MemoryRouter>
          <PostCreate />
        </MemoryRouter>,
      );

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      const titleErr = screen.getByText(
        'Failed title input validation message',
      );
      const contentErr = screen.getByText(
        'Failed content input validation message',
      );

      expect(titleErr.textContent).toMatch(
        'Failed title input validation message',
      );
      expect(contentErr.textContent).toMatch(
        'Failed content input validation message',
      );
    });

    it('should render form submit error', async () => {
      const user = userEvent.setup();

      submitPostCreate.mockReturnValue({ error: { message: 'Server Error' } });

      const { container } = render(
        <MemoryRouter>
          <PostCreate />
        </MemoryRouter>,
      );

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });
  });
});
