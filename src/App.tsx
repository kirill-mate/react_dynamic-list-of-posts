import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { useEffect, useState } from 'react';

import * as postsService from './api/posts';

import { UserSelector } from './components/UserSelector';
import { User } from './types/User';
import { Errors } from './types/Errors';
import { Post } from './types/Post';
import classNames from 'classnames';
import { PostDetails } from './components/PostDetails';
import { Comment } from './types/Comment';
import { MainContent } from './components/MainContent';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postComments, setPostComments] = useState<Comment[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [postsIsLoading, setPostsIsLoading] = useState(false);
  const [commentsIsLoading, setCommentsIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Empty);

  const [displayNewCommentForm, setDisplayNewCommentForm] = useState(false);
  const [displayCommentButton, setDisplayCommentButton] = useState(false);

  //#region loads
  function loadUsers() {
    postsService
      .getUsers()
      .then(resolve => setUsers(resolve))
      .catch(() => {
        setErrorMessage(Errors.Users);
      });
  }

  function loadUsersPosts(userId: number) {
    setPostsIsLoading(true);

    postsService
      .getUserPosts(userId)
      .then(resolve => setUserPosts(resolve))
      .catch(() => {
        setErrorMessage(Errors.Users);
      })
      .finally(() => setPostsIsLoading(false));
  }

  function loadPostComments(postId: number) {
    setCommentsIsLoading(true);

    postsService
      .getPostComments(postId)
      .then(resolve => setPostComments(resolve))
      .catch(() => {
        setErrorMessage(Errors.Comments);
        setDisplayCommentButton(false);
      })
      .finally(() => setCommentsIsLoading(false));
  }
  //#endregion

  function addComment(comment: Omit<Comment, 'id'>) {
    setIsSubmiting(true);

    return postsService
      .addComment(comment)
      .then(response => {
        setPostComments(prev => [...prev, response]);
      })
      .catch(error => {
        setErrorMessage(Errors.addComment);

        throw new Error(error);
      })
      .finally(() => {
        setIsSubmiting(false);
      });
  }

  function deleteComment(commentId: number) {
    setPostComments(currentComments =>
      currentComments.filter(comm => comm.id !== commentId),
    );

    postsService.deleteComment(commentId);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setUserPosts([]);
      loadUsersPosts(selectedUser?.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedPost) {
      setPostComments([]);
      loadPostComments(selectedPost?.id);
    }
  }, [selectedPost]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  onSelectUser={setSelectedUser}
                  selectedUser={selectedUser}
                  onSelectPost={setSelectedPost}
                />
              </div>
              <MainContent
                selectedUser={selectedUser}
                isLoading={postsIsLoading}
                errorMessage={errorMessage}
                userPosts={userPosts}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                setDisplayNewCommentForm={setDisplayNewCommentForm}
                setDisplayCommentButton={setDisplayCommentButton}
              />
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': selectedPost },
            )}
          >
            {selectedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails
                  post={selectedPost}
                  isLoading={commentsIsLoading}
                  errorMessage={errorMessage}
                  comments={postComments}
                  displayNewCommentForm={displayNewCommentForm}
                  setDisplayNewCommentForm={setDisplayNewCommentForm}
                  isSubmiting={isSubmiting}
                  onSubmit={addComment}
                  onDelete={deleteComment}
                  displayCommentButton={displayCommentButton}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
