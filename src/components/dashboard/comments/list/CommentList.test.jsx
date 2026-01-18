import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import CommentList from './CommentList';
import useComments from '../../../../hooks/useComments';
import submitCommentDelete from '../../../../api/submitCommentDelete';

vi.mock('../../../../hooks/useComments');
vi.mock('../../../../api/submitCommentDelete');

afterEach(() => {
  vi.clearAllMocks();
});

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
  {
    id: 2,
    name: 'foobar',
    email: 'foo@bar.com',
    content: 'Comment content 2',
    createdAt: '2025-12-04T00:00:00.000Z',
    updatedAt: '2025-12-04T00:00:00.000Z',
    published: true,
    postId: 2,
    post: {
      title: 'Post title 2',
    },
  },
];

const updatedComments = [
  {
    id: 2,
    name: 'foobar',
    email: 'foo@bar.com',
    content: 'Comment content 2',
    createdAt: '2025-12-04T00:00:00.000Z',
    updatedAt: '2025-12-04T00:00:00.000Z',
    published: true,
    postId: 2,
    post: {
      title: 'Post title 2',
    },
  },
];

describe('Comment List', () => {
  it('should render loading', async () => {
    useComments.mockReturnValue({
      comments: null,
      error: null,
      loading: true,
    });

    const { container } = render(<CommentList />);

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useComments.mockReturnValue({
      posts: null,
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<CommentList />);

    expect(container).toMatchSnapshot();
  });

  it('should render error', async () => {
    useComments.mockReturnValue({
      posts: null,
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(<CommentList />);

    expect(container).toMatchSnapshot();
  });

  it('should render comment list', async () => {
    useComments.mockReturnValue({
      comments,
      error: null,
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <CommentList />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Delete comment', () => {
    beforeAll(() => {
      useComments.mockReturnValue({
        comments,
        error: null,
        loading: false,
        update: false,
        setUpdate: vi.fn(),
      });
    });

    it('should render error', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <MemoryRouter>
          <CommentList />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      submitCommentDelete.mockReturnValue({
        error: { message: 'Server Error' },
      });

      await user.click(deleteButton[0]);

      expect(container).toMatchSnapshot();
    });

    it('should delete comment and render comment list', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <MemoryRouter>
          <CommentList />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      useComments.mockReturnValue({
        comments: updatedComments,
        error: null,
        loading: false,
      });

      submitCommentDelete.mockReturnValue({
        id: 1,
      });

      await user.click(deleteButton[0]);

      expect(container).toMatchSnapshot();
    });
  });
});
