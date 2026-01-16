import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import PostList from './PostList';
import usePosts from '../../../../hooks/usePosts';
import submitPostDelete from '../../../../api/submitPostDelete';

vi.mock('../../../../hooks/usePosts');
vi.mock('../../../../api/submitPostDelete');

afterEach(() => {
  vi.clearAllMocks();
});

const posts = [
  {
    id: 1,
    authorId: 1,
    title: 'Post title 1',
    content: 'Post content 1',
    createdAt: '2025-11-12T03:28:54.427Z',
    updatedAt: '2025-11-20T05:22:45.411Z',
    published: true,
    author: {
      name: 'foobar',
    },
  },
  {
    id: 2,
    authorId: 1,
    title: 'Post title 2',
    content: 'Post content 2',
    createdAt: '2026-01-12T03:28:54.427Z',
    updatedAt: '2026-10-02T05:22:45.411Z',
    published: true,
    author: {
      name: 'foobar',
    },
  },
];

const updatedPosts = [
  {
    id: 2,
    authorId: 1,
    title: 'Post title 2',
    content: 'Post content 2',
    createdAt: '2026-01-12T03:28:54.427Z',
    updatedAt: '2026-10-02T05:22:45.411Z',
    published: true,
    author: {
      name: 'foobar',
    },
  },
];

describe('Post List', () => {
  it('should render loading', async () => {
    usePosts.mockReturnValue({
      posts: null,
      error: null,
      loading: true,
    });

    const { container } = render(<PostList />);

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    usePosts.mockReturnValue({
      posts: null,
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(<PostList />);

    expect(container).toMatchSnapshot();
  });

  it('should render error ', async () => {
    usePosts.mockReturnValue({
      posts: null,
      error: { message: 'Server Error' },
      loading: false,
    });

    const { container } = render(<PostList />);

    expect(container).toMatchSnapshot();
  });

  it('should render post list', async () => {
    usePosts.mockReturnValue({
      posts,
      error: null,
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PostList />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Delete post', () => {
    it('should render error', async () => {
      const user = userEvent.setup();

      usePosts.mockReturnValue({
        posts,
        error: null,
        loading: false,
        update: false,
        setUpdate: vi.fn(),
      });

      const { container } = render(
        <MemoryRouter>
          <PostList />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      submitPostDelete.mockReturnValue({
        error: { message: 'Server Error' },
      });

      await user.click(deleteButton[0]);

      expect(container).toMatchSnapshot();
    });

    it('should delete post and render post list', async () => {
      const user = userEvent.setup();

      usePosts.mockReturnValue({
        posts,
        error: null,
        loading: false,
        update: false,
        setUpdate: vi.fn(),
      });

      const { container } = render(
        <MemoryRouter>
          <PostList />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      usePosts.mockReturnValue({
        posts: updatedPosts,
        error: null,
        loading: false,
      });

      submitPostDelete.mockReturnValue({
        id: 1,
      });

      await user.click(deleteButton[0]);

      expect(container).toMatchSnapshot();
    });
  });
});
