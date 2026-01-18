import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import Comments from './Comments';
import CommentList from './list/CommentList';
import CommentEdit from './edit/CommentEdit';
import useComments from '../../../hooks/useComments';
import useEditComment from '../../../hooks/useEditComment';
import submitCommentUpdate from '../../../api/submitCommentUpdate';

vi.mock('../../../hooks/useComments');
vi.mock('../../../hooks/useEditComment');
vi.mock('../../../api/submitCommentUpdate');

afterEach(() => {
  vi.clearAllMocks();
});

const routes = [
  {
    path: '/dashboard/comments',
    element: <Comments />,
    children: [
      { index: true, element: <CommentList /> },
      { path: ':postId/edit', element: <CommentEdit /> },
    ],
  },
];

const comments = [
  {
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

const updatedComment = {
  id: 1,
  name: 'foobar',
  email: 'foo@bar.com',
  content: 'Updated comment content 1',
  createdAt: '2025-12-04T00:00:00.000Z',
  updatedAt: '2025-12-25T00:00:00.000Z',
  published: false,
  postId: 1,
  post: {
    title: 'Post title 1',
  },
};

describe('Comments', () => {
  it('should render comments', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/comments'],
    });

    useComments.mockReturnValue({
      comments: null,
      error: null,
      loading: true,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  describe('Comment edit', () => {
    beforeAll(() => {
      useComments.mockReturnValue({
        comments,
        error: null,
        loading: false,
      });

      useEditComment.mockReturnValue({
        comment,
        error: null,
        loading: false,
      });

      submitCommentUpdate.mockReturnValue({
        id: 1,
      });
    });

    it('should render comment edit', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/comments'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const edit = screen.getByRole('link', { name: /edit/i });

      await user.click(edit);

      expect(container).toMatchSnapshot();
    });

    it('should submit comment edit and refresh page', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/comments'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const edit = screen.getByRole('link', { name: /edit/i });

      await user.click(edit);

      const submit = screen.getByRole('button', { name: /submit/i });

      useEditComment.mockReturnValue({
        comment: updatedComment,
        error: null,
        loading: false,
      });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });

    it('should cancel comment edit and render comment list', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/comments'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const edit = screen.getByRole('link', { name: /edit/i });

      await user.click(edit);

      const cancel = screen.getByRole('link', { name: /cancel/i });

      await user.click(cancel);

      expect(container).toMatchSnapshot();
    });
  });
});
