import { Router } from "express";
import { isAdmin, jwtAuth } from "../util/Middlewares.js";
import { UserController } from "../modules/user/UserController.js";
import { FollowController } from "../modules/follow/FollowController.js";
import { BookmarkController } from "../modules/bookmark/BookmarkController.js";
import { PostController } from "../modules/post/PostController.js";
import { CommentController } from "../modules/comment/CommentController.js";

/** 관리자 라우터
 *
 * @export
 * @param {Router} app
 */

export function adminRoutes(app) {
  const router = Router();
  const userController = new UserController();
  const followController = new FollowController();
  const bookmarkController = new BookmarkController();
  const postController = new PostController();
  const commentControlloer = new CommentController();

  router.get("/users", jwtAuth, isAdmin, userController.findAllUsers);
  router.delete(
    "/users/:userId",
    jwtAuth,
    isAdmin,
    userController.adminDeleteUser
  );
  router.get("/usercount", jwtAuth, isAdmin, userController.adminCountUsers);
  router.get(
    "/commentcount",
    jwtAuth,
    isAdmin,
    commentControlloer.adminCountComments
  );
  router.get("/postcount", jwtAuth, isAdmin, postController.adminCountPosts);
  router.delete(
    "/follows/:followerId/:followingId",
    jwtAuth,
    isAdmin,
    followController.adminDeleteFollow
  );
  router.delete(
    "/bookmarks/postId/:postId",
    jwtAuth,
    isAdmin,
    bookmarkController.deleteBookmarksByPostId
  );
  router.delete(
    "/bookmarks/userId/:userId",
    jwtAuth,
    isAdmin,
    bookmarkController.deleteBookmarksByUserId
  );
  router.delete(
    "/posts/:postId",
    jwtAuth,
    isAdmin,
    postController.adminDeletePost
  );
  router.delete(
    "/comments/:commentId",
    jwtAuth,
    isAdmin,
    commentControlloer.adminDeleteComment
  );

  app.use("/admin", router);
}
