import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import PostEdit from './PostEdit';
import useEditPost from '../../../../hooks/useEditPost';
import submitPostUpdate from '../../../../api/submitPostUpdate';

vi.mock('../../../api/submitPostUpdate');
vi.mock('../../../../hooks/useEditPost');
vi.mock('../../../../api/submitPostUpdate');

afterEach(() => {
  vi.clearAllMocks();
});

const routes = [
  {
    path: '/dashboard/posts/:postId/edit',
    element: <PostEdit />,
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

describe('Post Edit', () => {
  it('should render loading', async () => {
    useEditPost.mockReturnValue({
      post: null,
      error: null,
      loading: true,
    });

    const { container } = render(
      <MemoryRouter>
        <PostEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render error (unauthorized)', async () => {
    useEditPost.mockReturnValue({
      post: null,
      error: { statusCode: 401 },
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PostEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render post edit ', async () => {
    useEditPost.mockReturnValue({
      post,
      error: null,
      loading: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PostEdit />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Form submission', () => {
    beforeAll(() => {
      useEditPost.mockReturnValue({
        post,
        error: null,
        loading: false,
      });
    });

    it('should render user input and submit form', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts/1/edit'],
      });

      submitPostUpdate.mockReturnValue({
        error: null,
      });

      render(<RouterProvider router={router} />);

      const title = screen.getByRole('textbox', { name: /title/i });
      const content = screen.getByRole('textbox', { name: /content/i });
      const select = screen.getByRole('combobox', { name: /status/i });
      const unpublished = screen.getByRole('option', { name: /unpublished/i });

      await userEvent.clear(title);
      await userEvent.clear(content);

      await user.type(title, 'Edited post title');
      await user.type(content, 'Edited post content');
      await user.selectOptions(select, 'Unpublished');

      expect(title.value).toMatch('Edited post title');
      expect(content.value).toMatch('Edited post content');
      expect(unpublished.selected).toBe(true);
      expect(select.value).toBe('false');

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(submitPostUpdate).toHaveBeenCalledWith(
        '1',
        'Edited post title',
        'Edited post content',
        false,
      );
    });

    it('should render user input validation failed', async () => {
      const user = userEvent.setup();

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts/1/edit'],
      });

      submitPostUpdate.mockReturnValue({
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

      render(<RouterProvider router={router} />);

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

      const router = createMemoryRouter(routes, {
        initialEntries: ['/dashboard/posts/1/edit'],
      });

      submitPostUpdate.mockReturnValue({ error: { message: 'Server Error' } });

      const { container } = render(<RouterProvider router={router} />);

      const submit = screen.getByRole('button', { name: /submit/i });

      await user.click(submit);

      expect(container).toMatchSnapshot();
    });
  });
});
