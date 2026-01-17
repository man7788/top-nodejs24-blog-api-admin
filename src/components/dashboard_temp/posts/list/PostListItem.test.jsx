import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import PostListItem from './PostListItem';
import submitPostDelete from '../../../../api/submitPostDelete';

vi.mock('../../../../api/submitPostDelete');

afterEach(() => {
  vi.clearAllMocks();
});

const post = {
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
};

const setListError = vi.fn();
const setListLoading = vi.fn();
const update = false;
const setUpdate = vi.fn();

describe('Post List Item', () => {
  it('should render post list item', async () => {
    const { container } = render(
      <MemoryRouter>
        <PostListItem
          post={post}
          setListError={setListError}
          setListLoading={setListLoading}
          update={update}
          setUpdate={setUpdate}
        />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  describe('Delete submission', () => {
    it('should set post delete error', async () => {
      const user = userEvent.setup();

      submitPostDelete.mockReturnValue({
        error: { message: 'Server Error' },
      });

      render(
        <MemoryRouter>
          <PostListItem
            post={post}
            setListError={setListError}
            setListLoading={setListLoading}
            update={update}
            setUpdate={setUpdate}
          />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      await user.click(deleteButton[0]);

      expect(setListError).toHaveBeenCalledWith(true);
      expect(setListLoading).toHaveBeenCalledWith(false);
    });

    it('should submit post delete', async () => {
      const user = userEvent.setup();

      submitPostDelete.mockReturnValue({
        id: 1,
      });

      render(
        <MemoryRouter>
          <PostListItem
            post={post}
            setListError={setListError}
            setListLoading={setListLoading}
            update={update}
            setUpdate={setUpdate}
          />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      await user.click(deleteButton[0]);

      expect(submitPostDelete).toHaveBeenCalledWith(post.id);
      expect(setUpdate).toHaveBeenCalledWith(true);
      expect(setListLoading).toHaveBeenCalledWith(false);
    });
  });
});
