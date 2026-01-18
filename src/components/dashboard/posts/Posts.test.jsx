import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import Posts from './Posts';
import PostList from './list/PostList';
import PostCreate from './create/PostCreate';
import PostEdit from './edit/PostEdit';
import usePosts from '../../../hooks/usePosts';
import useVerifyToken from '../../../hooks/useVerifyToken';
import submitPostCreate from '../../../api/submitPostCreate';
import useEditPost from '../../../hooks/useEditPost';
import submitPostUpdate from '../../../api/submitPostUpdate';

vi.mock('../../../hooks/useAuth');
vi.mock('../../../hooks/usePosts');
vi.mock('../../../hooks/useVerifyToken');
vi.mock('../../../api/submitPostCreate');
vi.mock('../../../hooks/useEditPost');
vi.mock('../../../api/submitPostUpdate');

afterEach(() => {
  vi.clearAllMocks();
});

const routes = [
  {
    path: '/dashboard/posts',
    element: <Posts />,
    children: [
      { index: true, element: <PostList /> },
      { path: ':postId/edit', element: <PostEdit /> },
      { path: 'create', element: <PostCreate /> },
    ],
  },
];

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
];

const post = {
  id: 1,
  authorId: 1,
  title: 'Post title 1',
  content: 'Post content 1',
  createdAt: '2025-11-12T03:28:54.427Z',
  updatedAt: '2025-11-20T05:22:45.411Z',
  published: true,
};

const updatedPost = {
  id: 1,
  authorId: 1,
  title: 'Update post title 1',
  content: 'Update post content 1',
  createdAt: '2025-11-12T03:28:54.427Z',
  updatedAt: '2025-12-25T10:34:01.411Z',
  published: false,
};

describe('Posts', () => {
  it('should render posts', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard/posts'],
    });

    usePosts.mockReturnValue({
      posts: null,
      error: null,
      loading: true,
    });

    const { container } = render(<RouterProvider router={router} />);

    expect(container).toMatchSnapshot();
  });

  describe('Post create', () => {
    beforeAll(() => {
      useVerifyToken.mockReturnValue({
        error: null,
        loading: false,
      });
    });

    it('should render post create', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts'],
      });

      usePosts.mockReturnValue({
        posts: null,
        error: null,
        loading: true,
      });

      const { container } = render(<RouterProvider router={router} />);

      const create = screen.getByRole('link', { name: /create/i });

      await user.click(create);

      expect(container).toMatchSnapshot();
    });

    it('should submit post and render post list', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts'],
      });

      usePosts.mockReturnValue({
        posts: [],
        error: null,
        loading: false,
      });

      submitPostCreate.mockReturnValue({
        id: 1,
      });

      const { container } = render(<RouterProvider router={router} />);

      const create = screen.getByRole('link', { name: /create/i });

      await user.click(create);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });

    it('should cancel post create and render post list', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts'],
      });

      usePosts.mockReturnValue({
        posts: [],
        error: null,
        loading: false,
      });

      const { container } = render(<RouterProvider router={router} />);

      const create = screen.getByRole('link', { name: /create/i });

      await user.click(create);

      const cancel = screen.getByRole('link', { name: /cancel/i });

      await user.click(cancel);

      expect(container).toMatchSnapshot();
    });
  });

  describe('Post edit', () => {
    beforeAll(() => {
      usePosts.mockReturnValue({
        posts,
        error: null,
        loading: false,
      });

      useEditPost.mockReturnValue({
        post,
        error: null,
        loading: false,
      });

      submitPostUpdate.mockReturnValue({
        id: 1,
      });
    });

    it('should render post edit', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const edit = screen.getByRole('link', { name: /edit/i });

      await user.click(edit);

      expect(container).toMatchSnapshot();
    });

    it('should submit post edit and refresh page', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts'],
      });

      const { container } = render(<RouterProvider router={router} />);

      const edit = screen.getByRole('link', { name: /edit/i });

      await user.click(edit);

      const submit = screen.getByRole('button', { name: /submit/i });

      useEditPost.mockReturnValue({
        post: updatedPost,
        error: null,
        loading: false,
      });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });

    it('should cancel post edit and render post list', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts'],
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
