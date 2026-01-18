import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

import CommentListItem from './CommentListItem';
import submitCommentDelete from '../../../../api/submitCommentDelete';

vi.mock('../../../../hooks/useComments');
vi.mock('../../../../api/submitCommentDelete');

afterEach(() => {
  vi.clearAllMocks();
});

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

const setListError = vi.fn();
const setListLoading = vi.fn();
const update = false;
const setUpdate = vi.fn();

describe('Comment List Item', () => {
  it('should render comment list item', async () => {
    const { container } = render(
      <MemoryRouter>
        <CommentListItem
          comment={comment}
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
    it('should set comment delete error', async () => {
      const user = userEvent.setup();

      submitCommentDelete.mockReturnValue({
        error: { message: 'Server Error' },
      });

      render(
        <MemoryRouter>
          <CommentListItem
            comment={comment}
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

    it('should submit comment delete', async () => {
      const user = userEvent.setup();

      submitCommentDelete.mockReturnValue({
        id: 1,
      });

      render(
        <MemoryRouter>
          <CommentListItem
            comment={comment}
            setListError={setListError}
            setListLoading={setListLoading}
            update={update}
            setUpdate={setUpdate}
          />
        </MemoryRouter>,
      );

      const deleteButton = screen.getAllByRole('button', { name: /delete/i });

      await user.click(deleteButton[0]);

      expect(submitCommentDelete).toHaveBeenCalledWith(
        comment.postId,
        comment.id,
      );
      expect(setUpdate).toHaveBeenCalledWith(true);
      expect(setListLoading).toHaveBeenCalledWith(false);
    });
  });
});
