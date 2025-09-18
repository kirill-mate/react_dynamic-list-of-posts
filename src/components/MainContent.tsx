import { Errors } from '../types/Errors';
import { Post } from '../types/Post';
import { User } from '../types/User';
import { Loader } from './Loader';
import { PostsList } from './PostsList';

type Props = {
  selectedUser: User | null;
  isLoading: boolean;
  errorMessage: Errors;
  userPosts: Post[];
  selectedPost: Post | null;
  setDisplayCommentButton: (value: boolean) => void;
  setSelectedPost: (post: Post | null) => void;
  setDisplayNewCommentForm: (value: boolean) => void;
};

export const MainContent: React.FC<Props> = ({
  selectedUser,
  isLoading,
  errorMessage,
  userPosts,
  selectedPost,
  setDisplayCommentButton,
  setSelectedPost,
  setDisplayNewCommentForm,
}) => {
  return (
    <div className="block" data-cy="MainContent">
      {!selectedUser && <p data-cy="NoSelectedUser">No user selected</p>}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {errorMessage === Errors.Users ? (
            <div className="notification is-danger" data-cy="PostsLoadingError">
              {errorMessage}
            </div>
          ) : selectedUser && userPosts.length === 0 ? (
            <div className="notification is-warning" data-cy="NoPostsYet">
              No posts yet
            </div>
          ) : (
            userPosts.length > 0 && (
              <PostsList
                posts={userPosts}
                onSelectPost={setSelectedPost}
                selectedPost={selectedPost}
                setDisplayNewCommentForm={setDisplayNewCommentForm}
                setDisplayCommentButton={setDisplayCommentButton}
              />
            )
          )}
        </>
      )}
    </div>
  );
};
