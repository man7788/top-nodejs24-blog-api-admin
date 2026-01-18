import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import CommentEdit from './CommentEdit';
import useEditComment from '../../../../hooks/useEditComment';
import submitCommentUpdate from '../../../../api/submitCommentUpdate';

vi.mock('../../../../hooks/useEditComment');
vi.mock('../../../../api/submitCommentUpdate');

afterEach(() => {
  vi.clearAllMocks();
});

const routes = [
  {
    path: '/dashboard/comments/:commentId/edit',
    element: <CommentEdit />,
  },
];

const comment = {
  id: 1,
  name: 'foobar',
  email: 'foo@bar.com',
  content: 'Comment content 1',
  createdAt: '2025-12-04T00:00:00.000Z',
  updatedAt: '2025-12-04T00:00:00.000Z',
  published: true,
  postId: 1,
  post: {
    title: 'Post title 1',
  },
};

const mockLocationState = { postId: 1 };

describe('Comment Edit', () => {
  it('should render loading', async () => {
    useEditComment.mockReturnValue({
      comment: null,
      error: null,
      loading: true,
    });

    const { container } = render(
      <MemoryRouter
        initialEntries={[{ pathname: '/', state: mockLocationState }]}
      >
        <CommentEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useEditComment.mockReturnValue({
      comment: null,
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(
      <MemoryRouter
        initialEntries={[{ pathname: '/', state: mockLocationState }]}
      >
        <CommentEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render error', async () => {
    useEditComment.mockReturnValue({
      comment: null,
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(
      <MemoryRouter
        initialEntries={[{ pathname: '/', state: mockLocationState }]}
      >
        <CommentEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render comment edit', async () => {
    useEditComment.mockReturnValue({
      comment,
      error: null,
      loading: false,
    });

    const { container } = render(
      <MemoryRouter
        initialEntries={[{ pathname: '/', state: mockLocationState }]}
      >
        <CommentEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Form submission', () => {
    beforeAll(() => {
      useEditComment.mockReturnValue({
        comment,
        error: null,
        loading: false,
      });
    });

    it('should render user input and submit form', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: [
          { pathname: '/dashboard/comments/1/edit', state: mockLocationState },
        ],
      });

      submitCommentUpdate.mockReturnValue({
        error: null,
      });

      render(<RouterProvider router={router} />);

      const content = screen.getByRole('textbox', { name: /comment/i });
      const select = screen.getByRole('combobox', { name: /status/i });
      const unpublished = screen.getByRole('option', { name: /unpublished/i });

      await userEvent.clear(content);

      await user.type(content, 'Edited comment content');
      await user.selectOptions(select, 'Unpublished');

      expect(content.value).toMatch('Edited comment content');
      expect(unpublished.selected).toBe(true);
      expect(select.value).toBe('false');

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(submitCommentUpdate).toHaveBeenCalledWith(
        1,
        '1',
        'Edited comment content',
        false,
      );
    });

    it('should render user input validation failed', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: [
          { pathname: '/dashboard/comments/1/edit', state: mockLocationState },
        ],
      });

      submitCommentUpdate.mockReturnValue({
        error: {
          details: [
            {
              field: 'content',
              message: 'Failed content input validation message',
            },
          ],
        },
      });

      render(<RouterProvider router={router} />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      const contentErr = screen.getByText(
        'Failed content input validation message',
      );

      expect(contentErr.textContent).toMatch(
        'Failed content input validation message',
      );
    });

    it('should render form submit error', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: [
          { pathname: '/dashboard/comments/1/edit', state: mockLocationState },
        ],
      });

      submitCommentUpdate.mockReturnValue({
        error: { message: 'Server Error' },
      });

      const { container } = render(<RouterProvider router={router} />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });
  });
});
